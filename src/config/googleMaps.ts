// src/config/googleMaps.ts
import axios from 'axios';

export class GoogleMapsController {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCoordinates(address: string): Promise<{ lat: number; lng: number }> {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`
    );
    const location = response.data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };
  }
}
