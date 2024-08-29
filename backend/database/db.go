package database

import (
	"os"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"rul.sh/furina-id/models"
)

var db *gorm.DB

func Init() {
	dbPath := os.Getenv("DATABASE_PATH")
	if dbPath == "" {
		panic("DATABASE_PATH is not set")
	}

	var err error
	db, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	db.AutoMigrate(&models.Chat{})
}

func Get() *gorm.DB {
	return db
}
