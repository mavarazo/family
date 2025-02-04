package main

import (
	"embed"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/mavarazo/family/controller"
	"github.com/mavarazo/family/entity"
	"github.com/pressly/goose/v3"
)

//go:embed migrations/*.sql
var embedMigrations embed.FS

func main() {
	entity.Init()

	goose.SetBaseFS(embedMigrations)

	if err := goose.SetDialect("sqlite3"); err != nil {
		panic(err)
	}

	if err := goose.Up(entity.DB, "migrations"); err != nil {
		panic(err)
	}

	router := gin.Default()
	router.Use(cors.Default())
	v1 := router.Group("/api")
	controller.MealRegister(v1.Group("/meals"))
	controller.MealdateRegister(v1.Group("/mealdates"))

	router.Run()
}
