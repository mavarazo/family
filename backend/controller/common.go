package controller

import (
	"strconv"

	"github.com/gin-gonic/gin"
)

func ParamInt(c *gin.Context, key string) (int64, error) {
	val, err := strconv.ParseInt(c.Param(key), 10, 64)
	if err != nil {
		return 0, err
	}
	return val, err
}
