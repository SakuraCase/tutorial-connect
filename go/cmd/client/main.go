package main

import (
	"context"
	"fmt"
	"net/http"
	"time"

	greetv1 "example/gen/greet/v1"
	"example/gen/greet/v1/greetv1connect"

	"connectrpc.com/connect"
)

func greetServerStream(client greetv1connect.GreetServiceClient) {
	stream, err := client.GreetServerStream(
		context.Background(),
		connect.NewRequest(&greetv1.GreetRequest{Name: "Jane"}),
	)
	if err != nil {
		fmt.Println(err)
		return
	}
	for stream.Receive() {
		fmt.Println(stream.Msg().Greeting)
	}
}

func greetClientStream(client greetv1connect.GreetServiceClient) {
	stream := client.GreetClientStream(context.Background())
	for i := 0; i < 5; i++ {
		if err := stream.Send(&greetv1.GreetRequest{
			Name: "Jane",
		}); err != nil {
			fmt.Println(err)
		}
		time.Sleep(time.Second * 1)
	}
	res, err := stream.CloseAndReceive()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(res.Msg.GetGreeting())
}

func main() {
	client := greetv1connect.NewGreetServiceClient(
		http.DefaultClient,
		"http://localhost:8080",
	)

	// greetServerStream(client)
	greetClientStream(client)
}
