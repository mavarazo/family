package entity

import (
	"os"

	_ "github.com/mattn/go-sqlite3"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Init() {
	goEnv := os.Getenv("GO_ENV")
	databasePath := os.Getenv("FAMILY_DATABSE")

	if databasePath == "" && goEnv == "production" {
		databasePath = "/app/data/"
	}

	db, err := gorm.Open(sqlite.Open(databasePath+"database.sqlite3"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		panic(err)
	}

	db.AutoMigrate(&Meal{})
	db.AutoMigrate(&Mealdate{})

	DB = db
}
