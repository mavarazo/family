package controller

import (
	"strconv"

	"github.com/gin-gonic/gin"
)

func ParamInt(c *gin.Context, key string) (uint, error) {
	value, err := strconv.ParseUint(c.Param(key), 10, 64)
	if err != nil {
		return 0, err
	}
	return uint(value), err
}
