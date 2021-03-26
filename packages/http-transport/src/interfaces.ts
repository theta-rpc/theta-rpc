import { CorsOptions } from 'cors';
import express from 'express';

export interface IHTTPTransportContext {
  getRequest(): express.Request,
  getResponse(): express.Response
}

export interface IHTTPTransportOptions {
  hostname?: string,
  port?: number,
  path?: string,
  cors?: CorsOptions,
  express?: express.Application
  bodyLimit?: string
}
