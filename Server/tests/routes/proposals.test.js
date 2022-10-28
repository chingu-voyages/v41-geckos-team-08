const request = require('supertest');
const baseUrl = require('../../app');
const client = require('../../src/config/db');
const { initializeDB } = require('../common/initializeDB');
const createUser = require('../common/create-user');

const endpoint = '/proposals';

describe('Test the Proposals Rout', () => {
	beforeAll(async () => {
		await initializeDB(client);

		const customer = createUser(
			'customer@mail.com',
			'Pas$wordForCust0mer',
			false
		);
		const supplier = createUser(
			'supplier@mail.com',
			'Pas$wordForCust0mer',
			true
		);
	});
	afterAll(async () => {
		await client.end();
	});
	describe('Creating a proposal', () => {
		describe('Given the user send an invalid JSON', () => {
			it.todo('should return 400 when the JSON is empty');
			it.todo(
				'should return 400 when the user sends an invalid supplier_uuid'
			);
			it.todo(
				'should return 400 when the user sends an invalid job_uuid'
			);
			it.todo(
				'should return 400 when the user sends a non numeric price'
			);
			it.todo('should return 400 when the user sends an invalid date');
			it.todo('should return 400 when the user sends a past date');
			it.todo('should return 400 if the user is missing any field');
		});
		describe('Given the user sends a valid JSON', () => {
			it.todo(
				'should return 404 when the user sends an nonexistent supplier_uuid'
			);
			it.todo(
				'should return 404 when the user sends an nonexistent job_uuid'
			);
			it.todo('should return 201 if the proposal was created correctly');
			it.todo(
				'should return 409 if the supplier is trying to create another proposal for the same job'
			);
		});
	});
	describe('Getting the proposals', () => {
		describe('Given the user sends an invalid job_uuid', () => {
			it.todo('should return 400 if the user does not send the job uuid');
			it.todo('should return 400 if the user sends and invalid job uuid');
			it.todo(
				'should return 404 if the user sends a non existen job uuid'
			);
		});
		describe('Given the user sends a valid job_uuid', () => {
			it.todo('should return 200');
		});
		describe('Given the user sends a supplier_uuid', () => {
			it.todo(
				'should return 400 if the user sends and invalid supplier uuid'
			);
			it.todo(
				'should return 400 if the user sends a non existent supplier uuid'
			);
			it.todo(
				"should return 404 if the user sends a supplier_uuid that haven't sent a proposal"
			);
			it.todo(
				'should send a 200 if a proposal was found for that supplier in that job'
			);
		});
	});
	describe('Updating the proposal', () => {
		describe('Given the user sends an invalid job_uuid', () => {
			it.todo("should return 400 if the user doesn't send the job_uuid");
			it.todo('should return 400 if the user sends an invalid job_uuid');
			it.todo(
				'should return 404 if the user send a non existent job_uuid'
			);
		});
		describe('Given the user sends an invalid supplier_uuid', () => {
			it.todo(
				"should return 404 if the user doesn't send a supplier_uuid"
			);
			it.todo(
				'should return 400 if the user sends an invalid supplier_uuid'
			);
			it.todo(
				'should return 404 if the user sends a non existen supplier_uuid'
			);
		});
		describe('Given the user sends an invalid JSON', () => {
			it.todo('should return 400 if the user sends a non numeric price');
			it.todo('should return 400 if the user sends an invalid date');
			it.todo('should return 400 if the user sends a date in the past');
			it.todo('should return 400 if the is_accepted is not a boolean');
		});
		describe('Given the user sends a valid JSON', () => {
			it.todo('should return 200');
			describe('Given the user updates the is_accepted', () => {
				it.todo(
					'should return 200 and the job updated with the accepted supplier'
				);
			});
		});
	});
});
