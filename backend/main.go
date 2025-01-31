package main

import (
	"github.com/gin-gonic/gin"
	"github.com/mavarazo/family/common"
	meal "github.com/mavarazo/family/meal"
)

func main() {
	db := common.Init()

	db.AutoMigrate(&meal.Meal{})

	r := gin.Default()
	v1 := r.Group("/api")
	meal.MealRegister(v1.Group("/meals"))

	r.Run()
}
