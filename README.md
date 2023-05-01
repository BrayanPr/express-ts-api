# express-ts-api
A simple API made with express and typescript

To run this proyect, run docker-compose up -d.

To configure the project to run locally, in src/utils.ts change the connect_db method to connect the database (mysqltype), usually in localhost

To compile (insde the build folder) do npm run build. 

To run the current compiled version, do npm run start.

To run the projecr in dev mode (listening changes), do npm run dev.

To run the unit test, first configure the connection to the host, and inside that host create the demo_test database. Is it necesaty to run once the test, will trow full errors, but will create the tables, 
you need to create a user inside demo_test/users with the email t@t.t, and 'newPassword1.' as password. Then, create 2 teams in the teams table.
Ensure the user has 'super_admin' as role, and the teams to be the 1 and 2 (ids). Once that is done, run the tests
