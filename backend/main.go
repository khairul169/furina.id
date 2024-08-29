package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"rul.sh/furina-id/database"
	"rul.sh/furina-id/handler"
)

func main() {
	godotenv.Load()
	database.Init()

	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	// API handler
	api := app.Group("/api")
	handler.HandleChat(api)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8100"
	}

	fmt.Printf("Listening on http://localhost:%s\n", port)
	log.Fatal(app.Listen(fmt.Sprintf(":%s", port)))
}
