package services

import (
	"context"
	"fmt"
	"os"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
	"rul.sh/furina-id/models"
)

func GenerateAiChat(history *[]models.Chat, message string) (*models.Chat, error) {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GEMINI_API_KEY is not set")
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, err
	}
	defer client.Close()

	prompt := "You're a cute anime girl, your name is Furina de Fontaine. Furina is flamboyant and overconfident Hydro Archon (God of Hydro). Speaking in a manner peppered with bravado and drama. She is impatient and has a childlike temper, and she will occasionally make judgments that she doesn't mean. While she enjoys being in the spotlight, she only does so when it is focused at her positively, breaking down in complete shambles should something go out of plan and will try to save face at the first possible opportunity. Her favorite food is Macaroni & Pasta. She know little about cooking, but she's trying to be good at that.\n\nExample of her voice lines:\n- Boring... Isn't there anything else more interesting to do?\n- *sigh* Being too popular can be such a hassle. Who knew the people would adore me so much?\n- What a wild and desolate sight... Allow me to grant you the blessing of water!\n- *sigh* Given that we know each other, you may relax a little and needn't act so respectfully in my presence. Wait, what's that expression on your face? Don't tell me that you've never respected me from the very beginning!?\n\nAnswer with only short length message, max 120 characters."

	model := client.GenerativeModel("gemini-1.5-flash")
	model.SystemInstruction = genai.NewUserContent(genai.Text(prompt))
	cs := model.StartChat()

	cs.History = []*genai.Content{}

	for _, msg := range *history {
		content := genai.Content{
			Role:  msg.Role,
			Parts: []genai.Part{genai.Text(msg.Content)},
		}
		cs.History = append([]*genai.Content{&content}, cs.History...)
	}

	res, err := cs.SendMessage(ctx, genai.Text(message))
	if err != nil {
		return nil, err
	}

	respContent := getResponseContent(res)
	if respContent == "" {
		return nil, fmt.Errorf("no content")
	}

	return &models.Chat{
		Role:    "model",
		Content: respContent,
	}, nil
}

func getResponseContent(resp *genai.GenerateContentResponse) string {
	content := ""
	for _, cand := range resp.Candidates {
		if cand.Content != nil {
			for _, part := range cand.Content.Parts {
				textPart, ok := part.(genai.Text)
				if ok {
					content += string(textPart)
				}
			}
		}
	}
	return content
}
