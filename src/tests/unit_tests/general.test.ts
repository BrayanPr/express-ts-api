import { expect } from 'chai';
import {
  toUserUpdateDto,
  toHistoryDto,
  toAccountUpdateDto,
  toAccountDto,
  toTeamDto,
//   toAccountDto,
} from '../../utils';
import { AccountDTO } from '../../../types';

describe('toUserUpdateDto function', () => {
  it('should return an array of errors if there are validation errors', () => {
    const input = {
      name: '',
      cv: 123,
      experience: 456,
      englishLevel: 'D1',
    };
    const expected = ['name is required', 'englishLevel is not valid','cv must be string', 'experience must be string'];
    const result = toUserUpdateDto(input);
    expect(result).to.deep.equal(expected);
  });

  it('should return a UserUpdateDTO object if there are no validation errors', () => {
    const input = {
      name: 'John',
      cv: 'some cv',
      experience: 'some experience',
      englishLevel: 'B2',
    };
    const expected = {
      name: 'John',
      cv: 'some cv',
      experience: 'some experience',
      englishLevel: 'B2',
    };
    const result = toUserUpdateDto(input);
    expect(result).to.deep.equal(expected);
  });
});

describe('toHistoryDto function', () => {
  it('should return an array of errors if there are validation errors', () => {
    const input = {
      user: 'abc',
      teamJoin: 'def',
    };
    const expected = ['user must be integer', 'teamJoin must be number'];
    const result = toHistoryDto(input);
    expect(result).to.deep.equal(expected);
  });

  it('should return a HistoryDTO object if there are no validation errors', () => {
    const input = {
      user: 1,
      teamJoin: 2,
    };
    const expected = {
      user: 1,
      teamJoin: 2,
      teamLeft: null,
    };
    const result = toHistoryDto(input);
    expect(result).to.deep.equal(expected);
  });
});

describe('toAccountUpdateDto function', () => {
  it('should return an array of errors if there are validation errors', () => {
    const input = {
      name: 123,
      client: 456,
      manager: 789,
      teamId: 'abc',
    };
    const expected = ['name must be string', 'client must be string', 'manager must be string', 'teamId must be numeric'];
    const result = toAccountUpdateDto(input);
    expect(result).to.deep.equal(expected);
  });

  it('should return an AccountDTO object if there are no validation errors', () => {
    const input = {
      name: 'some name',
      client: 'some client',
      manager: 'some manager',
      teamId: 1,
    };
    const expected = {
      name: 'some name',
      client: 'some client',
      manager: 'some manager',
      teamId: 1,
    };
    const result = toAccountUpdateDto(input);
    expect(result).to.deep.equal(expected);
  });
});

describe('toAccountDto', () => {
  it('should return an AccountDTO object if all required fields are present and valid', () => {
    const input = {
      name: 'Acme Inc.',
      client: 'John Doe',
      manager: 'Jane Smith',
      teamId:1
    };
    const expectedOutput:AccountDTO = {
      name: 'Acme Inc.',
      client: 'John Doe',
      manager: 'Jane Smith',
      teamId: 1,
    };
    let res = toAccountDto(input)
    expect(res).to.deep.equal(expectedOutput);
  });

  it('should return an array of errors if any required field is undefined', () => {
    const input = {
      client: 'John Doe',
      manager: 'Jane Smith',
      teamId:1
    };
    const expectedOutput = ['name is required'];
    expect(toAccountDto(input)).to.deep.equal(expectedOutput);
  });

  it('should return an array of errors if any required field is null', () => {
    const input = {
      name:null,
      client: 'John Doe',
      manager: 'Jane Smith',
      teamId:1
    };
    const expectedOutput = ['name is required'];
    expect(toAccountDto(input)).to.deep.equal(expectedOutput);
  });

  it('should return an array of errors if client field is null', () => {
    const input = {
      name: 'Acme Inc.',
      client: null,
      manager: 'Jane Smith',
      teamId:1
    };
    const expectedOutput = ['client is required'];
    expect(toAccountDto(input)).to.deep.equal(expectedOutput);
  });
  it('should return an array of errors if any client is undefined', () => {
    const input = {
      name: 'Acme Inc.',
      manager: 'Jane Smith',
      teamId:1
    };
    const expectedOutput = ['client is required'];
    expect(toAccountDto(input)).to.deep.equal(expectedOutput);
  });
  it('should return an array of errors if manager field is null', () => {
    const input = {
      name: 'Acme Inc.',
      manager: null,
      client: 'Jane Smith',
      teamId:1
    };
    const expectedOutput = ['manager is required'];
    expect(toAccountDto(input)).to.deep.equal(expectedOutput);
  });
  it('should return an array of errors if any manager is undefined', () => {
    const input = {
      name: 'Acme Inc.',
      client: 'Jane Smith',
      teamId:1
    };
    const expectedOutput = ['manager is required'];
    expect(toAccountDto(input)).to.deep.equal(expectedOutput);
  });
});

describe("toTeamDto", () => {
  it("should return an error array when required properties are missing", () => {
    const body = { name: null, description: null };
    const result = toTeamDto(body);
    expect(result).to.deep.equal(["name is required"]);
  });

  it("should return an error array when properties have invalid types", () => {
    const body = { name: 123, description: false };
    const result = toTeamDto(body);
    expect(result).to.deep.equal([
      "name must be string",
      "description must be string"
    ]);
  });

  it("should return a TeamDTO object when properties are valid", () => {
    const body = {
      name: "My Team",
      description: "A team of developers"
    };
    const result = toTeamDto(body);
    expect(result).to.deep.equal({
      name: "My Team",
      description: "A team of developers"
    });
  });
});
