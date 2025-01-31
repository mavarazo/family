package common

import (
	"fmt"
	"os"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Database struct {
	*gorm.DB
}

var DB *gorm.DB

func Init() *gorm.DB {
	goEnv := os.Getenv("GO_ENV")
	databasePath := os.Getenv("FAMILY_DATABSE")

	if databasePath == "" && goEnv == "production" {
		databasePath = "/app/data/"
	}

	db, err := gorm.Open(sqlite.Open(databasePath+"database.sqlite3"), &gorm.Config{})
	if err != nil {
		fmt.Println("db err: (Init) ", err)
	}
	DB = db
	return db
}

func GetDatabase() *gorm.DB {
	return DB
}
