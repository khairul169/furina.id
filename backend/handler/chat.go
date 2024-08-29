package handler

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/utils"
	"gorm.io/gorm"
	"rul.sh/furina-id/database"
	"rul.sh/furina-id/models"
	"rul.sh/furina-id/services"
)

var initialChat = models.Chat{
	Role:    "model",
	Content: "Ah, finally someone worthy of my time! What shall we do today?",
}

func getAll(c *fiber.Ctx) error {
	sessionId := getSessionId(c)
	if sessionId == 0 {
		return c.JSON([]models.Chat{initialChat})
	}

	fmt.Println(sessionId)

	db := database.Get()
	var chats []models.Chat

	if result := db.Where("session_id = ?", sessionId).Order("id DESC").Limit(10).Find(&chats); result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"message": result.Error.Error()})
	}

	result := []fiber.Map{}
	for _, chat := range chats {
		result = append(result, fiber.Map{"id": chat.ID, "role": chat.Role, "content": chat.Content})
	}

	result = append(result, fiber.Map{
		"id":      initialChat.ID,
		"role":    initialChat.Role,
		"content": initialChat.Content,
	})

	return c.JSON(result)
}

type CreateChatPayload struct {
	Message string `json:"message"`
}

func create(c *fiber.Ctx) error {
	sessionId := getSessionId(c)
	db := database.Get()

	if sessionId == 0 {
		var err error
		sessionId, err = createSession(c)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"message": err.Error()})
		}
	}

	if count := getTotalChatsLastHour(); count > 60 {
		return c.Status(500).JSON(fiber.Map{"message": "Too many chats. Please try again later."})
	}

	data := CreateChatPayload{}
	if err := c.BodyParser(&data); err != nil {
		return c.Status(500).JSON(fiber.Map{"message": err.Error()})
	}

	msg := models.Chat{
		SessionID: sessionId,
		Role:      "user",
		Content:   data.Message,
	}

	history := []models.Chat{}
	db.Where("session_id = ?", sessionId).Order("id DESC").Limit(10).Find(&history)
	history = append([]models.Chat{msg}, history...)

	err := db.Transaction(func(tx *gorm.DB) error {
		resp, err := services.GenerateAiChat(&history, msg.Content)
		if err != nil {
			return err
		}
		if r := tx.Create(&msg); r.Error != nil {
			return r.Error
		}

		resp.SessionID = sessionId
		if r := tx.Create(&resp); r.Error != nil {
			return r.Error
		}
		return nil
	})

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": err.Error()})
	}

	return c.JSON(msg)
}

func HandleChat(router fiber.Router) {
	router.Get("/chats", getAll)
	router.Post("/chats", create)
}

func getSessionId(c *fiber.Ctx) uint {
	uuid := c.Cookies("session_id")

	if uuid == "" {
		return 0
	}

	db := database.Get()
	var session models.Session
	db.Where("uuid = ?", uuid).First(&session)

	return session.ID
}

func createSession(c *fiber.Ctx) (uint, error) {
	uuid := utils.UUIDv4()

	db := database.Get()
	session := models.Session{
		UUID: uuid,
	}

	if result := db.Create(&session); result.Error != nil {
		return 0, result.Error
	}

	c.Cookie(&fiber.Cookie{
		Name:     "session_id",
		Value:    uuid,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
	})

	return session.ID, nil
}

func getTotalChatsLastHour() int64 {
	var count int64
	oneHourAgo := time.Now().Add(-1 * time.Hour)

	r := database.Get().Model(&models.Chat{}).
		Where("created_at >= ?", oneHourAgo).
		Count(&count)

	if r.Error != nil {
		return 0
	}

	return count
}
