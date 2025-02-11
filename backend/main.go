package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/mavarazo/family/controller"
	"github.com/mavarazo/family/entity"
)

func main() {
	entity.Init()

	router := gin.Default()
	router.Use(cors.Default())
	v1 := router.Group("/api")
	controller.MealRegister(v1.Group("/meals"))
	controller.MealdateRegister(v1.Group("/mealdates"))

	router.Run()
}
