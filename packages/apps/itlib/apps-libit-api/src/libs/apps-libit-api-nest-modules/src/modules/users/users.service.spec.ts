import { Test, TestingModule } from '@nestjs/testing';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import upperCase from 'lodash/upperCase';
import keys from 'lodash/keys';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDtoUpdateOneWhole } from './users.dto.updateOneWhole';
import { UsersEntity } from './users.entity';
import {
  getUsersDtoCreateOneFixture,
  getUsersDtoFindManyFixture,
  getUsersDtoUpdateOnePartialWithPatternFixture,
  getUsersEntityFixture,
  getUsersDtoUpdateOnePartialFixture,
  getUsersDtoUpdateOneWholeFixture,
  getUsersDtoDeleteManyFixture,
} from './users.utils.fixtures';
import { UsersDtoFindMany } from './users.dto.findMany';
import { UsersDtoCreateOne } from './users.dto.createOne';
import { UsersDtoUpdateOnePartial } from './users.dto.updateOnePartial';
import { UsersDtoUpdateOnePartialWithPattern } from './users.dto.updateManyPartialWithPattern';
import { UsersDtoDeleteMany } from './users.dto.deleteMany';

describe('UsersService', () => {
  let testUsersEntity: UsersDtoUpdateOneWhole;
  let testUsersEntities: UsersDtoUpdateOneWhole[];
  let usersService: UsersService;
  let usersRepositoryCreateMock: jest.Mock;
  let usersRepositoryFindOneByMock: jest.Mock;
  let usersRepositoryFindByMock: jest.Mock;
  let usersRepositorySaveMock: jest.Mock;
  let usersRepositoryRemoveMock: jest.Mock;
  let testUsersRepositoryQueryBuilder: Partial<SelectQueryBuilder<UsersEntity>>;
  let usersRepositoryCreateQueryBuilderMock: jest.Mock;
  let usersRepositoryQueryBuilderSelectMock: jest.Mock;
  let usersRepositoryQueryBuilderWhereMock: jest.Mock;
  let usersRepositoryQueryBuilderAndWhereMock: jest.Mock;
  let usersRepositoryQueryBuilderOrderByMock: jest.Mock;
  let usersRepositoryQueryBuilderSetParametersMock: jest.Mock;
  let usersRepositoryQueryBuilderSkipMock: jest.Mock;
  let usersRepositoryQueryBuilderTakeMock: jest.Mock;
  let usersRepositoryQueryBuilderGetRawManyMock: jest.Mock;
  let usersRepositoryMock: Partial<Repository<UsersEntity>>;
  let usersRepositoryMockFactory: () => Partial<Repository<UsersEntity>>;

  beforeEach(async () => {
    testUsersEntity = getUsersEntityFixture();
    testUsersEntities = [
      getUsersEntityFixture({ id: 'test_id_1' }),
      getUsersEntityFixture({ id: 'test_id_2' }),
    ];
    usersRepositoryCreateMock = jest.fn();
    usersRepositoryFindOneByMock = jest.fn();
    usersRepositoryFindByMock = jest.fn();
    usersRepositoryRemoveMock = jest.fn();
    usersRepositorySaveMock = jest
      .fn()
      .mockImplementation((usersEntities) => usersEntities);
    testUsersRepositoryQueryBuilder = {
      select: jest.fn(),
      where: jest.fn(),
      andWhere: jest.fn(),
      orderBy: jest.fn(),
      setParameters: jest.fn(),
      skip: jest.fn(),
      take: jest.fn(),
      getRawMany: jest.fn(),
    };
    usersRepositoryCreateQueryBuilderMock = jest
      .fn()
      .mockReturnValue(testUsersRepositoryQueryBuilder);
    usersRepositoryQueryBuilderSelectMock = jest
      .fn()
      .mockReturnValue(testUsersRepositoryQueryBuilder);
    usersRepositoryQueryBuilderWhereMock = jest
      .fn()
      .mockReturnValue(testUsersRepositoryQueryBuilder);
    usersRepositoryQueryBuilderAndWhereMock = jest
      .fn()
      .mockReturnValue(testUsersRepositoryQueryBuilder);
    usersRepositoryQueryBuilderOrderByMock = jest
      .fn()
      .mockReturnValue(testUsersRepositoryQueryBuilder);
    usersRepositoryQueryBuilderSetParametersMock = jest
      .fn()
      .mockReturnValue(testUsersRepositoryQueryBuilder);
    usersRepositoryQueryBuilderSkipMock = jest
      .fn()
      .mockReturnValue(testUsersRepositoryQueryBuilder);
    usersRepositoryQueryBuilderTakeMock = jest
      .fn()
      .mockReturnValue(testUsersRepositoryQueryBuilder);
    usersRepositoryQueryBuilderGetRawManyMock = jest
      .fn()
      .mockReturnValue(testUsersEntities);
    Object.assign(testUsersRepositoryQueryBuilder, {
      select: usersRepositoryQueryBuilderSelectMock,
      where: usersRepositoryQueryBuilderWhereMock,
      andWhere: usersRepositoryQueryBuilderAndWhereMock,
      orderBy: usersRepositoryQueryBuilderOrderByMock,
      setParameters: usersRepositoryQueryBuilderSetParametersMock,
      skip: usersRepositoryQueryBuilderSkipMock,
      take: usersRepositoryQueryBuilderTakeMock,
      getRawMany: usersRepositoryQueryBuilderGetRawManyMock,
    });
    usersRepositoryMock = {
      create: usersRepositoryCreateMock,
      createQueryBuilder: usersRepositoryCreateQueryBuilderMock,
      findOneBy: usersRepositoryFindOneByMock,
      findBy: usersRepositoryFindByMock,
      remove: usersRepositoryRemoveMock,
      save: usersRepositorySaveMock,
    };
    usersRepositoryMockFactory = () => usersRepositoryMock;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UsersEntity),
          useFactory: usersRepositoryMockFactory,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('Should create an instance of UsersService', () => {
    expect(usersService).toBeDefined();
  });

  describe('createOne', () => {
    let usersDtoCreateOne: UsersDtoCreateOne;

    beforeEach(() => {
      usersDtoCreateOne = getUsersDtoCreateOneFixture();
    });

    it('Should call usersRepository.create with a UsersDtoCreateOne, usersRepository.save with the created user, and return the created user', async () => {
      usersRepositoryCreateMock.mockReturnValue(testUsersEntity);

      const usersEntity = await usersService.createOne(usersDtoCreateOne);

      expect(usersRepositoryCreateMock).toHaveBeenNthCalledWith(
        1,
        usersDtoCreateOne,
      );
      expect(usersRepositorySaveMock).toHaveBeenNthCalledWith(1, usersEntity);
      expect(usersEntity).toEqual(testUsersEntity);
    });
  });

  describe('findOne', () => {
    it('Should call usersRepository.findOneBy, with a unique key, and return the found user', async () => {
      usersRepositoryFindOneByMock.mockReturnValue(testUsersEntity);

      const usersEntity = await usersService.findOne(
        'username',
        testUsersEntity.username,
      );

      expect(usersRepositoryFindOneByMock).toHaveBeenNthCalledWith(1, {
        username: testUsersEntity.username,
      });
      expect(usersEntity).toEqual(testUsersEntity);
    });
  });

  describe('findMany', () => {
    let usersDtoFindMany: UsersDtoFindMany;

    beforeEach(() => {
      usersDtoFindMany = getUsersDtoFindManyFixture();
    });

    it('Should create a query builder, select all records, and return the found users', async () => {
      const usersEntities = await usersService.findMany(usersDtoFindMany);

      expect(usersRepositoryCreateQueryBuilderMock).toHaveBeenNthCalledWith(1);
      expect(usersRepositoryQueryBuilderSelectMock).toHaveBeenNthCalledWith(
        1,
        '*',
      );
      expect(usersEntities).toEqual(testUsersEntities);
    });

    it('Should filter the query by ids when the ids param is passed', async () => {
      await usersService.findMany(usersDtoFindMany);

      expect(usersRepositoryQueryBuilderWhereMock).toHaveBeenNthCalledWith(
        1,
        'id = :id',
        { id: In(usersDtoFindMany.ids) },
      );
    });

    it('Should not filter the query by ids if no ids param is passed', async () => {
      usersDtoFindMany = getUsersDtoFindManyFixture({ ids: undefined });
      await usersService.findMany(usersDtoFindMany);

      expect(usersRepositoryQueryBuilderWhereMock).not.toHaveBeenCalled();
    });

    it('Should filter the query by username, email, and phoneNumber when the search param is passed', async () => {
      await usersService.findMany(usersDtoFindMany);

      expect(usersRepositoryQueryBuilderAndWhereMock).toHaveBeenNthCalledWith(
        1,
        'username = :username',
        {
          username: usersDtoFindMany.search,
        },
      );
      expect(usersRepositoryQueryBuilderAndWhereMock).toHaveBeenNthCalledWith(
        2,
        'email = :email',
        { email: usersDtoFindMany.search },
      );
      expect(usersRepositoryQueryBuilderAndWhereMock).toHaveBeenNthCalledWith(
        3,
        'phoneNumber = :phoneNumber',
        {
          phoneNumber: usersDtoFindMany.search,
        },
      );
    });

    it('Should not filter the query by username, email, or phoneNumber if no search param is passed', async () => {
      usersDtoFindMany = getUsersDtoFindManyFixture({ search: undefined });
      await usersService.findMany(usersDtoFindMany);

      expect(usersRepositoryQueryBuilderAndWhereMock).not.toHaveBeenCalled();
    });

    it('Should sort the query by the sortBy param if one is passed', async () => {
      await usersService.findMany(usersDtoFindMany);

      expect(usersRepositoryQueryBuilderOrderByMock).toHaveBeenNthCalledWith(
        1,
        ':sortBy',
        expect.anything(),
      );
      expect(
        usersRepositoryQueryBuilderSetParametersMock,
      ).toHaveBeenNthCalledWith(1, { sortBy: usersDtoFindMany.sortBy });
    });

    it('Should order the query by username if no sortBy param is passed', async () => {
      usersDtoFindMany = getUsersDtoFindManyFixture({ sortBy: undefined });
      await usersService.findMany(usersDtoFindMany);

      expect(usersRepositoryQueryBuilderOrderByMock).toHaveBeenNthCalledWith(
        1,
        ':sortBy',
        expect.anything(),
      );
      expect(
        usersRepositoryQueryBuilderSetParametersMock,
      ).toHaveBeenNthCalledWith(1, { sortBy: 'username' });
    });

    it('Should order the query in the sortOrder param order if one is passed', async () => {
      await usersService.findMany(usersDtoFindMany);

      expect(usersRepositoryQueryBuilderOrderByMock).toHaveBeenNthCalledWith(
        1,
        ':sortBy',
        upperCase(usersDtoFindMany.sortOrder),
      );
    });

    it('Should order the query in asc order if no sortOrder param is passed', async () => {
      usersDtoFindMany = getUsersDtoFindManyFixture({ sortOrder: undefined });
      await usersService.findMany(usersDtoFindMany);

      expect(usersRepositoryQueryBuilderOrderByMock).toHaveBeenNthCalledWith(
        1,
        ':sortBy',
        'ASC',
      );
    });

    it('Should skip and take records from the query according to the page and resultsPerPage params if they are passed', async () => {
      await usersService.findMany(usersDtoFindMany);

      expect(usersRepositoryQueryBuilderSkipMock).toHaveBeenNthCalledWith(
        1,
        usersDtoFindMany.resultsPerPage * (usersDtoFindMany.page - 1),
      );
      expect(usersRepositoryQueryBuilderTakeMock).toHaveBeenNthCalledWith(
        1,
        usersDtoFindMany.resultsPerPage,
      );
    });

    it('Should not skip any- and take infinity- records from the query if the resultsPerPage param is not passed', async () => {
      usersDtoFindMany = getUsersDtoFindManyFixture({
        resultsPerPage: undefined,
      });
      await usersService.findMany(usersDtoFindMany);

      expect(usersRepositoryQueryBuilderSkipMock).toHaveBeenNthCalledWith(1, 0);
      expect(usersRepositoryQueryBuilderTakeMock).toHaveBeenNthCalledWith(
        1,
        Infinity,
      );
    });

    it('Should not skip any- but take records from the query, according to the if the resultsPerPage param, if the page param is not passed', async () => {
      usersDtoFindMany = getUsersDtoFindManyFixture({ page: undefined });
      await usersService.findMany(usersDtoFindMany);

      expect(usersRepositoryQueryBuilderSkipMock).toHaveBeenNthCalledWith(1, 0);
      expect(usersRepositoryQueryBuilderTakeMock).toHaveBeenNthCalledWith(
        1,
        usersDtoFindMany.resultsPerPage,
      );
    });

    it('Should not skip any- but take records from the query, according to the if the resultsPerPage param, if the page param is 1', async () => {
      usersDtoFindMany = getUsersDtoFindManyFixture({ page: 1 });
      await usersService.findMany(usersDtoFindMany);

      expect(usersRepositoryQueryBuilderSkipMock).toHaveBeenNthCalledWith(1, 0);
      expect(usersRepositoryQueryBuilderTakeMock).toHaveBeenNthCalledWith(
        1,
        usersDtoFindMany.resultsPerPage,
      );
    });
  });

  describe('updateManyWhole', () => {
    let usersDtoUpdateOneWholeArray: UsersDtoUpdateOneWhole[];

    beforeEach(() => {
      usersDtoUpdateOneWholeArray = [
        getUsersDtoUpdateOneWholeFixture({ id: 'test_id_1' }),
        getUsersDtoUpdateOneWholeFixture({ id: 'test_id_2' }),
      ];
    });

    it('Should call usersRepository.findBy with ids of the passed users, usersRepository.save with the updated users, and return the updated users', async () => {
      usersRepositoryFindByMock.mockReturnValue([
        getUsersEntityFixture({
          id: usersDtoUpdateOneWholeArray[0].id,
          username: 'old_username',
        }),
        getUsersEntityFixture({
          id: usersDtoUpdateOneWholeArray[1].id,
          username: 'old_username',
        }),
      ]);

      const usersEntities = await usersService.updateManyWhole(
        usersDtoUpdateOneWholeArray,
      );

      expect(usersRepositoryFindByMock).toHaveBeenNthCalledWith(1, {
        id: In(
          usersDtoUpdateOneWholeArray.map((usersEntity) => usersEntity.id),
        ),
      });
      expect(usersEntities).toEqual(usersDtoUpdateOneWholeArray);
    });

    it('Should throw an error if all users to be updated dont exist', async () => {
      usersRepositoryFindByMock.mockReturnValue([]);

      await expect(
        usersService.updateManyWhole(usersDtoUpdateOneWholeArray),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateManyPartial', () => {
    let usersDtoUpdateManyPartialObject: Record<
      UsersEntity['id'],
      UsersDtoUpdateOnePartial
    >;

    beforeEach(() => {
      usersDtoUpdateManyPartialObject = {
        [testUsersEntities[0].id]: getUsersDtoUpdateOnePartialFixture(),
        [testUsersEntities[1].id]: getUsersDtoUpdateOnePartialFixture(),
      };
    });

    it('Should call usersRepository.findBy with ids of the passed partial users, usersRepository.save with the updated users, and return the updated users', async () => {
      usersRepositoryFindByMock.mockReturnValue([
        getUsersEntityFixture({
          id: testUsersEntities[0].id,
          username: 'old_username',
        }),
        getUsersEntityFixture({
          id: testUsersEntities[1].id,
          username: 'old_username',
        }),
      ]);

      const usersEntities = await usersService.updateManyPartial(
        usersDtoUpdateManyPartialObject,
      );

      expect(usersRepositoryFindByMock).toHaveBeenNthCalledWith(1, {
        id: In(keys(usersDtoUpdateManyPartialObject)),
      });
      expect(usersEntities[0].username).toEqual(
        usersDtoUpdateManyPartialObject[testUsersEntities[0].id].username,
      );
      expect(usersEntities[1].username).toEqual(
        usersDtoUpdateManyPartialObject[testUsersEntities[1].id].username,
      );
    });

    it('Should throw an error if all users to be updated dont exist', async () => {
      usersRepositoryFindByMock.mockReturnValue([]);

      await expect(
        usersService.updateManyPartial(usersDtoUpdateManyPartialObject),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateManyPartialWithPattern', () => {
    let usersDtoUpdateOnePartialWithPattern: UsersDtoUpdateOnePartialWithPattern;

    beforeEach(() => {
      usersDtoUpdateOnePartialWithPattern =
        getUsersDtoUpdateOnePartialWithPatternFixture();
    });

    it('Should call usersRepository.findBy with ids of the passed partial users, usersRepository.save with the updated users, and return the updated users', async () => {
      usersRepositoryFindByMock.mockReturnValue([
        getUsersEntityFixture({
          id: usersDtoUpdateOnePartialWithPattern.ids[0],
          username: 'old_username',
        }),
        getUsersEntityFixture({
          id: usersDtoUpdateOnePartialWithPattern.ids[1],
          username: 'old_username',
        }),
      ]);

      const usersEntities = await usersService.updateManyPartialWithPattern(
        usersDtoUpdateOnePartialWithPattern,
      );

      expect(usersRepositoryFindByMock).toHaveBeenNthCalledWith(1, {
        id: In(usersDtoUpdateOnePartialWithPattern.ids),
      });
      expect(usersEntities[0].username).toEqual(
        usersDtoUpdateOnePartialWithPattern.usersDtoUpdateOnePartial.username,
      );
      expect(usersEntities[1].username).toEqual(
        usersDtoUpdateOnePartialWithPattern.usersDtoUpdateOnePartial.username,
      );
    });

    it('Should throw an error if all users to be updated dont exist', async () => {
      usersRepositoryFindByMock.mockReturnValue([]);

      await expect(
        usersService.updateManyPartialWithPattern(
          usersDtoUpdateOnePartialWithPattern,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteMany', () => {
    let usersDtoDeleteMany: UsersDtoDeleteMany;

    beforeEach(() => {
      usersDtoDeleteMany = getUsersDtoDeleteManyFixture();
    });

    it('Should call usersRepository.findBy with passed ids param and usersRepository.remove with the found users', async () => {
      usersRepositoryFindByMock.mockReturnValue(testUsersEntities);

      await usersService.deleteMany(usersDtoDeleteMany);

      expect(usersRepositoryFindByMock).toHaveBeenNthCalledWith(1, {
        id: In(usersDtoDeleteMany.ids),
      });
      expect(usersRepositoryRemoveMock).toHaveBeenNthCalledWith(
        1,
        testUsersEntities,
      );
    });

    it('Should throw an error if all users to be updated dont exist', async () => {
      usersRepositoryFindByMock.mockReturnValue([]);

      await expect(usersService.deleteMany(usersDtoDeleteMany)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
