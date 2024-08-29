package models

import (
	"time"
)

type Base struct {
	ID        uint      `gorm:"primarykey" json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// type SoftDelete struct {
// 	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
// }
