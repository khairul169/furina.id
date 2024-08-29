package models

type Session struct {
	Base

	UUID string `gorm:"uniqueIndex" json:"uuid"`
}
