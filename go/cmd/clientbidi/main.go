package main

import (
	"context"
	"crypto/tls"
	"errors"
	"fmt"
	"io"
	"net"
	"net/http"
	"sync"
	"time"

	greetv1 "example/gen/greet/v1"
	"example/gen/greet/v1/greetv1connect"

	"golang.org/x/net/http2"
)

func greetBidiStream(client greetv1connect.GreetServiceClient) {
	stream := client.GreetBidiStream(context.Background())

	var wg sync.WaitGroup
	wg.Add(2)
	go func() {
		defer wg.Done()
		for i := 0; i < 5; i++ {
			fmt.Println("send")
			if err := stream.Send(&greetv1.GreetRequest{
				Name: fmt.Sprintf("%s (%d)", "Jane", i),
			}); err != nil {
				fmt.Println(err)
			}
			time.Sleep(time.Second * 1)
		}
		stream.CloseRequest()
	}()

	go func() {
		defer wg.Done()
		for i := 0; i < 5; i++ {
			fmt.Println("receive")
			msg, err := stream.Receive()
			if errors.Is(err, io.EOF) {
				break
			}
			if err != nil {
				fmt.Println(err)
				break
			}
			fmt.Println("Received:", msg.GetGreeting())
		}
		stream.CloseResponse()
	}()
	wg.Wait()
}

func main() {
	greetBidiStream(greetv1connect.NewGreetServiceClient(
		newInsecureClient(),
		"http://localhost:8080",
	))
}

func newInsecureClient() *http.Client {
	return &http.Client{
		Transport: &http2.Transport{
			AllowHTTP: true,
			DialTLS: func(network, addr string, _ *tls.Config) (net.Conn, error) {
				// If you're also using this client for non-h2c traffic, you may want
				// to delegate to tls.Dial if the network isn't TCP or the addr isn't
				// in an allowlist.
				return net.Dial(network, addr)
			},
			// Don't forget timeouts!
		},
	}
}
