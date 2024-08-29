package models

type Chat struct {
	Base

	SessionID uint    `json:"session_id"`
	Session   Session `json:"session"`
	Role      string  `json:"role"`
	Content   string  `json:"content"`
}
