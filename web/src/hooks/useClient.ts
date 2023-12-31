import { useMemo } from "react";
import { ServiceType } from "@bufbuild/protobuf";
import { createConnectTransport } from "@bufbuild/connect-web";
import { createPromiseClient, PromiseClient } from "@bufbuild/connect";

// This transport is going to be used throughout the app
const transport = createConnectTransport({
  baseUrl: "http://localhost:8080",
});

/**
* Get a promise client for the given service.
*/
export function useClient<T extends ServiceType>(service: T): PromiseClient<T> {
  // We memoize the client, so that we only create one instance per service.
  return useMemo(() => createPromiseClient(service, transport), [service]);
}