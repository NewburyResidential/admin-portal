## Summary

This admin portal, built using Next.js, is a platform designed as a tool to be used by Newbury Residential. Next.js simplifies server-side rendering, routing, and data fetching to enable a fast, SEO-friendly application. Leveraging it's capabilities, this portal offers a responsive, performance-driven interface for simplifying and automating administrative tasks.

## Stack

- **Node.js Enviorment**: Capable of running v18
- **Languages**: Primarly relies on Javascript and CSS
- **Next.js Framework**:  Managing latest versions of Next.js, including beta, with api route handlers, app directory, src directory and eslint implemented. Did not include typescript or tailwind.
- **MUI Styling**: Material-UI is used as a styling library to build out JSX components
- **Azure AD Authentication**: Authentication with registered users in Azure AD, specific to Newbury's tenant. User's must also be registered as a user to the admin-portal. Currently handled thorough integrations with Supabase, but will reconfigure to Next-Auth with database change.
- **Supabase Database**: Integration with Supabase for data, file and realtime storage.
- **Hosting Via Vercel:** Published website is connected via github repo.

## App To Do's

 - [ ] Reconfigure Directory Hierarchy
	 - [ ] Incorporate module aliases either by absolute or paths
	 - [ ] Determine how public/private components are structured
	 - [ ] Create common practice for utils/libs/hooks/models etc
	 - [ ] Delete unused components and libraries

- [ ] Utility Upload
  - [ ] Include/check ignored files and duplicated files in response
  - [ ] Add Loading/Progress state
  - [ ] Include Format Checker
	
- [ ] Define ES Linting rules
	- [ ] Enforce strict default import with MUI components (optimize performance)
	- [ ] Ensure ES linting configures well with GitHub collaboration
	- [ ] Define prettier to configure to ES linting
	
- [ ] Set up basic SEO
- [ ] Set up Error Handling Page
	- [ ] Bubble Up Errors to one page with Reference ID and Basic Explanation to issue
	
- [ ] Create Boiler Routes Folder
	- [ ] Allow navigation to map routes object
	- [ ] Include with each: icon/paths/name/id/roles/subpaths etc 
	
 - [ ] Discuss App Monitoring Needs
	 - [ ]  Error handling Implementation
	- [ ] Implement built in / add on performance monitoring
	- [ ] Security Vulnerabilities And Notifications

- [ ] Change environments
	- [ ] Reconfigure Azure Authentication
	- [ ] Reconfigure Azure Database and API
	
- [ ] Implement best practice for caching data
- [ ] Update Logo with Text SVG

## Getting Started

### Prerequisites

Before getting started, make sure you have the following installed and configured:

- Node.js and npm: Make sure you have Node.js (v16 or higher) and npm installed on your development machine.

### Installation

1. Clone the repository to your local machine:
        
    ```
   git clone https://github.com/your-username/admin.git
    ```
    
3. Change into the project directory:
        
    ```
   cd admin
    ```
    
5. Install the project dependencies:
        
    ```
   npm install
    ```

### Configuration

1. Create a `.env.local` file in the root directory of your project
2. Include necessary configs as shown in `config-global.js` 

### Development

To start the development server, run:

```
npm run dev
```

The admin portal should now be accessible at http://localhost:3034

## Build
To build and run the project locally, follow these steps: 

1. Check the entire app for linting errors and warnings
  ```
  npm run lint
  ```

If ESLint reports any issues, review and address them based on the provided recommendations

3. After clearing errors and warnings, build the app
```
npm run build
```
4. Start the app
```
npm run start
```



