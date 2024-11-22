export default function updateAccountsWithEmployees(creditCardAccounts, employees) {
  creditCardAccounts.forEach((account) => {
    account.owner = null;
    account.reviewers = [];

    employees.forEach((employee) => {
      if (employee.creditCardAccountOwner === account.pk) {
        account.owner = employee.pk;
      }

      if (employee.creditCardAccountsToReview && employee.creditCardAccountsToReview.includes(account.pk)) {
        account.reviewers.push(employee.pk);
      }
    });
  });
  return creditCardAccounts;
}
