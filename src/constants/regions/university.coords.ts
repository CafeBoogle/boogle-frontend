import { Coordinates } from './region.types';

export const UNIVERSITY_COORDS: Record<string, Record<string, Coordinates>> = {
  sogang: {
    정문: { lat: 37.5509, lng: 126.9411 },
    후문: { lat: 37.5525, lng: 126.9425 },
    남문: { lat: 37.5495, lng: 126.94 },
  },
  hongik: {
    정문: { lat: 37.5507, lng: 126.9255 },
    상수역: { lat: 37.5477, lng: 126.9227 },
  },
  yonsei: {
    정문: { lat: 37.5612, lng: 126.9368 },
    서문: { lat: 37.5645, lng: 126.9285 },
  },
  ewha: {
    정문: { lat: 37.5591, lng: 126.9454 },
  },
  hapjeong: {
    합정역: { lat: 37.5496, lng: 126.9138 },
  },
  all: {
    전체: { lat: 37.5612, lng: 126.9368 },
  },
};
