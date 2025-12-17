// utils/user.ts
export function getDisplayName(
    ownerName?: string,
    firstName?: string,
    lastName?: string
): string {
    if (ownerName) return ownerName;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (lastName) return lastName;
    return 'Unknown';
}
