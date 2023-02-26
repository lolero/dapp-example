import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { requestsUtilCrossCheckIds } from './requests.util.crossCheckIds';

describe('requestsUtilCrossCheckIds', () => {
  let requestedIds: number[];
  let foundEntities: { id: number }[] = [];

  it('Should not throw an error if the found entities match the requested ids exactly', () => {
    requestedIds = [1, 2, 3, 4];
    foundEntities = [1, 3, 4, 2].map((id) => ({ id }));
    expect(() =>
      requestsUtilCrossCheckIds(requestedIds, foundEntities),
    ).not.toThrow();
  });

  it('Should throw an error if duplicate ids are requested', () => {
    requestedIds = [1, 2, 3, 4, 4];
    foundEntities = requestedIds.map((id) => ({ id }));
    expect(() =>
      requestsUtilCrossCheckIds(requestedIds, foundEntities),
    ).toThrow(BadRequestException);
    expect(() =>
      requestsUtilCrossCheckIds(requestedIds, foundEntities),
    ).toThrow('request error. duplicate ids.');
  });

  it('Should throw an error if duplicate ids are found', () => {
    requestedIds = [1, 2, 3, 4];
    foundEntities = [...requestedIds, 4].map((id) => ({ id }));
    expect(() =>
      requestsUtilCrossCheckIds(requestedIds, foundEntities),
    ).toThrow(InternalServerErrorException);
    expect(() =>
      requestsUtilCrossCheckIds(requestedIds, foundEntities),
    ).toThrow('duplicate entities found');
  });

  it('Should throw an error if not all requested ids are found', () => {
    requestedIds = [1, 2, 3, 4];
    foundEntities = [1, 2].map((id) => ({ id }));
    expect(() =>
      requestsUtilCrossCheckIds(requestedIds, foundEntities),
    ).toThrow(NotFoundException);
    expect(() =>
      requestsUtilCrossCheckIds(requestedIds, foundEntities),
    ).toThrow('entities not found. missing ids: 3, 4');
  });

  it('Should throw an error if entities that were not requested are found', () => {
    requestedIds = [1, 2, 3, 4];
    foundEntities = [1, 2, 3, 4, 5].map((id) => ({ id }));
    expect(() =>
      requestsUtilCrossCheckIds(requestedIds, foundEntities),
    ).toThrow(InternalServerErrorException);
    expect(() =>
      requestsUtilCrossCheckIds(requestedIds, foundEntities),
    ).toThrow('error finding requested entities');
  });
});
