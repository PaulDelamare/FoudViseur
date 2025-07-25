import * as SQLite from 'expo-sqlite';
import { DbMeal, DbFood, CreateMealData } from '../types/database';

class DatabaseService {
    private db: SQLite.SQLiteDatabase | null = null;
    private currentVersion = 3;
    private initPromise: Promise<void> | null = null;

    async init() {
        if (this.db) return;

        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = this.performInit();
        return this.initPromise;
    }

    private async performInit() {
        try {
            this.db = await SQLite.openDatabaseAsync('meals.db');

            await this.createTables();
            await this.runMigrations();

        } catch (error) {

            console.error('Erreur lors de l\'initialisation de la base de données:', error);
            this.db = null;
            throw error;

        } finally {
            this.initPromise = null;
        }
    }

    private async createTables() {
        if (!this.db) throw new Error('Database not initialized');

        await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS meals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        totalCalories REAL NOT NULL,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

        await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS foods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mealId INTEGER NOT NULL,
        name TEXT NOT NULL,
        brand TEXT,
        image TEXT,
        calories REAL NOT NULL,
        proteins REAL,
        carbs REAL,
        fats REAL,
        quantity REAL NOT NULL DEFAULT 1,
        measure TEXT NOT NULL DEFAULT 'portion',
        isScanned INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (mealId) REFERENCES meals (id) ON DELETE CASCADE
      );
    `);

        await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_foods_mealId ON foods(mealId);
      CREATE INDEX IF NOT EXISTS idx_meals_date ON meals(date);
    `);

        await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS db_version (
        version INTEGER PRIMARY KEY
      );
    `);
    }

    private async runMigrations() {
        if (!this.db) throw new Error('Database not initialized');

        const result = await this.db.getFirstAsync('SELECT version FROM db_version ORDER BY version DESC LIMIT 1') as { version: number } | null;
        const currentDbVersion = result?.version || 1;

        if (currentDbVersion < this.currentVersion) {

            if (currentDbVersion === 1) {
                try {

                    await this.db.execAsync('ALTER TABLE foods ADD COLUMN image TEXT;');

                } catch (error) {
                    console.error('La colonne image existe probablement déjà');
                }
            }

            await this.db.execAsync('DELETE FROM db_version');
            await this.db.runAsync('INSERT INTO db_version (version) VALUES (?)', [this.currentVersion]);
        }
    }

    async createMeal(mealData: CreateMealData): Promise<number> {
        if (!this.db) await this.init();

        let mealId: number = 0;

        await this.db!.withTransactionAsync(async () => {

            const mealResult = await this.db!.runAsync(
                'INSERT INTO meals (date, totalCalories, createdAt) VALUES (?, ?, ?)',
                [mealData.date, mealData.totalCalories, new Date().toISOString()]
            );

            mealId = mealResult.lastInsertRowId;

            for (const food of mealData.foods) {
                await this.db!.runAsync(
                    `INSERT INTO foods (mealId, name, brand, image, calories, proteins, carbs, fats, quantity, measure, isScanned) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        mealId,
                        food.name,
                        food.brand || null,
                        food.image || null,
                        food.calories,
                        food.proteins || null,
                        food.carbs || null,
                        food.fats || null,
                        food.quantity,
                        food.measure,
                        food.isScanned ? 1 : 0
                    ]
                );
            }
        });

        return mealId;
    }

    async getMealsByDate(date: string): Promise<(DbMeal & { foods: DbFood[] })[]> {
        if (!this.db) await this.init();

        const meals = await this.db!.getAllAsync(
            'SELECT * FROM meals WHERE date = ? ORDER BY createdAt DESC',
            [date]
        ) as DbMeal[];

        const mealsWithFoods = await Promise.all(
            meals.map(async (meal) => {
                const foods = await this.db!.getAllAsync(
                    'SELECT * FROM foods WHERE mealId = ?',
                    [meal.id]
                ) as DbFood[];

                return { ...meal, foods };
            })
        );

        return mealsWithFoods;
    }

    async getMealById(id: number): Promise<(DbMeal & { foods: DbFood[] }) | null> {
        try {
            if (!this.db) await this.init();
            if (!this.db) throw new Error('Impossible d\'initialiser la base de données');

            const meal = await this.db.getFirstAsync(
                'SELECT * FROM meals WHERE id = ?',
                [id]
            ) as DbMeal | null;

            if (!meal) {
                return null;
            }

            const foods = await this.db.getAllAsync(
                'SELECT * FROM foods WHERE mealId = ?',
                [id]
            ) as DbFood[];

            return { ...meal, foods };
        } catch (error) {
            console.error('Erreur lors de la récupération du repas par ID:', error);
            throw error;
        }
    }

    async deleteMeal(id: number): Promise<void> {
        try {
            if (!this.db) await this.init();
            if (!this.db) throw new Error('Impossible d\'initialiser la base de données');

            await this.db.runAsync('DELETE FROM meals WHERE id = ?', [id]);

        } catch (error) {
            console.error('Erreur lors de la suppression du repas:', error);
            throw error;
        }
    }

    async getRecentMeals(limit: number = 10): Promise<(DbMeal & { foods: DbFood[] })[]> {
        if (!this.db) await this.init();

        const meals = await this.db!.getAllAsync(
            'SELECT * FROM meals ORDER BY createdAt DESC LIMIT ?',
            [limit]
        ) as DbMeal[];

        const mealsWithFoods = await Promise.all(
            meals.map(async (meal) => {
                const foods = await this.db!.getAllAsync(
                    'SELECT * FROM foods WHERE mealId = ?',
                    [meal.id]
                ) as DbFood[];

                return { ...meal, foods };
            })
        );

        return mealsWithFoods;
    }
}

export const databaseService = new DatabaseService();
