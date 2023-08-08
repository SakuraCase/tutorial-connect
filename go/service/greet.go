package service

import (
	"context"
	"fmt"
	"log"
	"time"

	"connectrpc.com/connect"

	greetv1 "example/gen/greet/v1" // generated by protoc-gen-go
)

type GreetServer struct{}

func (s *GreetServer) Greet(
	ctx context.Context,
	req *connect.Request[greetv1.GreetRequest],
) (*connect.Response[greetv1.GreetResponse], error) {
	log.Println("Request headers: ", req.Header())
	res := connect.NewResponse(&greetv1.GreetResponse{
		Greeting: fmt.Sprintf("Hello, %s!", req.Msg.Name),
	})
	res.Header().Set("Greet-Version", "v1")
	return res, nil
}

func (s *GreetServer) GreetServerStream(
	ctx context.Context,
	req *connect.Request[greetv1.GreetRequest],
	stream *connect.ServerStream[greetv1.GreetResponse],
) error {
	log.Println("Request headers: ", req.Header())
	stream.ResponseHeader().Set("Greet-Version", "v1")
	for i := 0; i < 5; i++ {
		err := stream.Send(&greetv1.GreetResponse{
			Greeting: fmt.Sprintf("Hello, %s!", req.Msg.Name),
		})
		if err != nil {
			return err
		}

		time.Sleep(time.Second * 1)
	}

	return nil
}

func (s *GreetServer) GreetClientStream(
	ctx context.Context,
	stream *connect.ClientStream[greetv1.GreetRequest],
) (*connect.Response[greetv1.GreetResponse], error) {
	log.Println("Request headers: ", stream.RequestHeader())
	for stream.Receive() {
		fmt.Printf("Hello, %s!\n", stream.Msg().Name)
	}
	if err := stream.Err(); err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}
	res := connect.NewResponse(&greetv1.GreetResponse{
		Greeting: "Hello!",
	})
	res.Header().Set("Greet-Version", "v1")
	return res, nil
}
