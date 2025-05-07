# Final Implementation Plan for Project Request Management

## Step 1: Add the List View Component

Create `ProjectListView.tsx` with a simplified approach that shows all projects and handles permissions based on user context.

## Step 2: Add CSS for the List View

Create `ProjectListView.module.scss` with basic styling for the list view.

## Step 3: Update the Web Part

Modify `PrmWebPart.ts` to handle switching between list and form views.

## Step 4: Update the Form Component

Add a back button to `ProjectRequestForm.tsx` to return to the list view.

## Step 5: Add String Resources

Update localization files with new strings for the list view.

## Step 6: Test and Deploy

1. Test the web part in all three modes (Create, Edit, View)
2. Verify permissions work correctly
3. Deploy to SharePoint

## Key Considerations

1. **Permissions**: Commercial team creates forms, departments edit assigned forms, approved forms are read-only
2. **Document Management**: Each project has a document set for attachments
3. **Workflow**: Use Nintex to manage the approval process
4. **Mobile Support**: Ensure the interface works on all devices

## Future Enhancements

1. Add filtering by department and status
2. Implement notifications for new assignments
3. Add reporting features
4. Create a dashboard view showing project statistics

Thank you for your patience! This implementation will provide a solid foundation for your project request management system while respecting the constraints of your SharePoint 2019 environment.

## Permission Management Advice for SharePoint 2019 Environment

## 1. SharePoint Permission Levels

Create custom permission levels for different roles:

- **Commercial Department**: Full control over project requests
- **Department Contributors**: Edit permissions on assigned projects only
- **Approvers**: Ability to approve/reject but not modify content
- **Viewers**: Read-only access to approved projects

## 2. Item-Level Permissions

Use item-level permissions to control access to individual project requests:

```typescript
// Example of setting unique permissions on a new item
async function setUniquePermissions(listName: string, itemId: number, departmentGroupIds: number[]) {
  // Break inheritance
  const endpoint = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})/breakroleinheritance(true)`;
  
  await context.spHttpClient.post(
    endpoint,
    SPHttpClient.configurations.v1,
    {
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
        'X-RequestDigest': await getFormDigest()
      }
    }
  );
  
  // Grant permissions to department groups
  for (let i = 0; i < departmentGroupIds.length; i++) {
    const roleEndpoint = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})/roleassignments/addroleassignment(principalid=${departmentGroupIds[i]},roledefid=1073741827)`;
    
    await context.spHttpClient.post(
      roleEndpoint,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=verbose',
          'Content-Type': 'application/json;odata=verbose',
          'X-RequestDigest': await getFormDigest()
        }
      }
    );
  }
}
```

## 3. Status-Based Permission Changes

When a project is approved, remove edit permissions:

```typescript
// Example of removing edit permissions when project is approved
async function setReadOnlyPermissions(listName: string, itemId: number) {
  // First break inheritance if not already broken
  const breakInheritanceEndpoint = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})/breakroleinheritance(false)`;
  
  await context.spHttpClient.post(
    breakInheritanceEndpoint,
    SPHttpClient.configurations.v1,
    {
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
        'X-RequestDigest': await getFormDigest()
      }
    }
  );
  
  // Then add read permission for everyone
  const readPermissionEndpoint = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})/roleassignments/addroleassignment(principalid=1073741823,roledefid=1073741826)`;
  
  await context.spHttpClient.post(
    readPermissionEndpoint,
    SPHttpClient.configurations.v1,
    {
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
        'X-RequestDigest': await getFormDigest()
      }
    }
  );
}
```

## 4. Document Set Permissions

Ensure document set permissions match the project request permissions:

```typescript
// Example of syncing permissions between project and document set
async function syncDocumentSetPermissions(projectId: number, documentSetUrl: string) {
  // Get the document set item ID
  const docSetUrlParts = documentSetUrl.split('ID=');
  if (docSetUrlParts.length < 2) return;
  
  const docSetId = docSetUrlParts[1].split(',')[0];
  
  // Copy permissions from project to document set
  const endpoint = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('ProjectRequests')/items(${projectId})/copyroleassignments(${docSetId})`;
  
  await context.spHttpClient.post(
    endpoint,
    SPHttpClient.configurations.v1,
    {
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
        'X-RequestDigest': await getFormDigest()
      }
    }
  );
}
```

## 5. Nintex Workflow Integration for Permissions

Use Nintex workflows to automate permission changes:

1. **On Creation**: Set initial permissions for Commercial Department
2. **On Assignment**: Add permissions for assigned departments
3. **On Approval**: Remove edit permissions, set to read-only
4. **On Rejection**: Reset permissions to allow edits

## 6. Security Best Practices

1. **Principle of Least Privilege**: Grant only the permissions needed
2. **Regular Audits**: Review permissions periodically
3. **Permission Inheritance**: Use inheritance where possible to simplify management
4. **Group-Based Permissions**: Assign permissions to groups, not individuals
5. **Document Permissions**: Ensure document libraries have appropriate permissions

## 7. UI Considerations for Permissions

1. **Hide Actions**: Don't show edit/delete buttons for items users can't modify
2. **Clear Messaging**: Explain permission restrictions to users
3. **Request Access**: Provide a way for users to request access if needed
4. **Audit Logging**: Log permission changes for accountability

By implementing these permission strategies, you'll ensure that your project request system maintains proper security while providing the right level of access to each department based on their role in the process.
