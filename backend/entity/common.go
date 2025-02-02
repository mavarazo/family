package entity

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func Init() {
	goEnv := os.Getenv("GO_ENV")
	databasePath := os.Getenv("FAMILY_DATABSE")

	if databasePath == "" && goEnv == "production" {
		databasePath = "/app/data/"
	}

	db, err := sql.Open("sqlite3", databasePath+"database.sqlite3")
	if err != nil {
		panic(err)
	}

	DB = db
}

func Commit(tx *sql.Tx) {
	if err := tx.Commit(); err != nil {
		log.Fatalln(err)
	}
}
