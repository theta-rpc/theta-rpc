import http from 'http';
import { CorsOptions } from 'cors';
import express from 'express';
import https from 'https';

export type HTTPTransportContextType = {
  getRequest(): express.Request;
  getResponse(): express.Response;
}

export type CommonOptionsType = {
  hostname?: string,
  port: number,
  path?: string,
  cors?: CorsOptions,
  bodySize?: string
}

export type HTTPTransportOptionsType = {
  express?: express.Application;
  https?: CommonOptionsType & https.ServerOptions;
  http?: CommonOptionsType & http.ServerOptions;
};
