import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { action } from '@ember/object';
import {
  randomCoordinateAround,
  randomCoordinatesAround,
} from 'dummy/utils/coordinates';

export default class ApplicationController extends Controller {
  @service
  googleMapsApi;

  lat = '51.507568';
  lng = '0';

  locations = A();

  constructor() {
    super(...arguments);

    let { lat, lng } = this;
    this.getLocations({ lat, lng }, 1000).then((locations) =>
      this.locations.pushObjects(locations)
    );
  }

  async getLocations(center, count) {
    await this.googleMapsApi.google;

    return randomCoordinatesAround(center, count);
  }

  @action
  addRandomLocation() {
    let { lat, lng } = this;
    this.locations.pushObject(randomCoordinateAround({ lat, lng }));
  }

  @action
  removeFirstLocation() {
    this.locations.shiftObject();
  }
}
