import { Client } from 'pg';
import { ContactInterface } from '../types';
require('dotenv').config();

const connectionString = process.env.CONNECTION_DB;

export class DBService {
	
	static instance;
	private client: Client;

	constructor() {
		if (DBService.instance) {
			return DBService.instance;
		}
		DBService.instance = this;
		this.client = new Client({ connectionString: connectionString });
		this.connection();
	}

	private connection() : void {
		this.client.connect(err => {
			if (err) throw err;
			console.log('connected');
		});
	}

	public async getContacts(): Promise<any> {
		try {
			const listContacts:ContactInterface[] = [];
			const persons = await this.client.query('SELECT * FROM person');
	
			for (let person of persons.rows) {
				let objectRolesList = await this.client.query(`SELECT role_name 
																											 FROM person inner join person_in_roles ON  person.id = person_in_roles.id 
																										   WHERE person.id = ${person.id}`);
				listContacts.push({
					id: person.id,
					name: person.full_name,
					picture: person.picture,
					roles: this.getArryRoles(objectRolesList.rows),
					telephone: person.telephone,
					isActive: person.is_active
				});
			}
			
			return listContacts.sort((a, b) => a.name.localeCompare(b.name));
		} catch (ex) {
			console.error(ex);
			throw 'Failed to get all contacts';
		}
	}

	private getArryRoles(objectRolesList) : string[] {
		const stringRolesList : string[] = [];
		for (let role of objectRolesList) {
			stringRolesList.push(role.role_name);
		}
		return stringRolesList;
	}

	public async addContact(picture: string ,contact: ContactInterface): Promise<any> {
		try {
			const id = (
				await this.client.query(`INSERT INTO person (full_name, telephone, picture, is_active) 
				                       	 VALUES ('${contact.name}','${contact.telephone}','${picture}',${contact.isActive}) 
					                       RETURNING id`)).rows[0].id;
	
			for (let role of contact.roles) {
				const flagExist = await this.isRoleExist(role);
				if (!flagExist) {
					await this.client.query(`INSERT INTO roles (role_name) 
														       VALUES ('${role}')`);
				}
				await this.client.query(`INSERT INTO person_in_roles (id,role_name) 
														     VALUES (${id},'${role}')`);
			}
		} catch (ex) {
			console.error(ex);
			throw 'Failed to add contact';
		}
	}

	private async isRoleExist(role_name: string) : Promise<any> {
			try {
				const res = await this.client.query(`SELECT * 
																				     FROM roles 
																				     WHERE role_name = '${role_name}'`);
				if (res.rows.length > 0) return true;
				else return false;
			} catch (ex) {
				  throw ex;
			}
	}

	public async deleteContact(id: number): Promise<any> {
		try {
			await this.client.query(`DELETE FROM person_in_roles 
			                         WHERE id = ${id}`);
			await this.client.query(`DELETE FROM person 
			                         WHERE id = ${id}`);
	} catch (ex) {
		console.error(ex);
		throw 'Failed to delete contact';
	}
}

	public async setContact(contact: ContactInterface): Promise<any> {
		try {
				await this.client.query(`DELETE FROM person_in_roles 
														     WHERE id = ${contact.id}`);
				for (let role of contact.roles) {
					const flagExist = await this.isRoleExist(role);
					if (!flagExist) {
						await this.client.query(`INSERT INTO roles (role_name) 
																		 VALUES ('${role}')`);
					}
					await this.client.query(`INSERT INTO person_in_roles (id,role_name) 
														       VALUES (${contact.id},'${role}')`);
				}
			   await this.client.query(`UPDATE person
														 	    SET  full_name = '${contact.name}',
															    telephone = '${contact.telephone}' ,
															    picture = '${contact.picture}',
														    	is_active = ${contact.isActive}
															    WHERE
															    id = ${contact.id}`);
		} catch (ex) {
			console.error(ex);
			throw 'Failed to set contact';
		}
	}

}
