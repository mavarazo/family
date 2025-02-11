package entity

import (
	"database/sql"
	"database/sql/driver"
	"encoding/json"
	"time"
)

type LocalDate time.Time

var _ json.Unmarshaler = &LocalDate{}

const dateFormat = "2006-01-02"

func (localDate *LocalDate) Scan(value interface{}) (err error) {
	nullTime := &sql.NullTime{}
	err = nullTime.Scan(value)
	*localDate = LocalDate(nullTime.Time)
	return
}

func (localDate LocalDate) Value() (driver.Value, error) {
	y, m, d := time.Time(localDate).Date()
	return time.Date(y, m, d, 0, 0, 0, 0, time.Time(localDate).Location()), nil
}

func (localDate *LocalDate) UnmarshalJSON(bs []byte) error {
	var s string
	err := json.Unmarshal(bs, &s)
	if err != nil {
		return err
	}
	t, err := time.ParseInLocation(dateFormat, s, time.UTC)
	if err != nil {
		return err
	}
	*localDate = LocalDate(t)
	return nil
}

func (localDate *LocalDate) MarshalJSON() ([]byte, error) {
	return json.Marshal(time.Time(*localDate).Format(dateFormat))
}
