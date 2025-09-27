import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationContainer: HTMLElement | null = null;

  constructor() {}

  showNotification(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    this.createNotificationContainer();

    const alertClass = this.getAlertClass(type);
    const notificationElement = document.createElement('div');
    notificationElement.className = `alert ${alertClass} alert-dismissible fade show`;
    notificationElement.role = 'alert';

    // Apply custom styles
    notificationElement.style.position = 'fixed';
    notificationElement.style.top = '20px'; // Move to top
    notificationElement.style.left = '50%';
    notificationElement.style.transform = 'translateX(-50%)';
    notificationElement.style.zIndex = '1050';
    notificationElement.style.width = '400px'; // Increase width
    notificationElement.style.padding = '15px'; // Increase padding
    notificationElement.style.fontSize = '1.2rem'; // Make text larger
    notificationElement.style.fontWeight = 'bold'; // Make text bold
    notificationElement.style.color = '#ffffff'; // Text color (white)

    // Define background color for each type
    notificationElement.style.backgroundColor = this.getBackgroundColor(type);

    notificationElement.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    this.notificationContainer?.appendChild(notificationElement);

    // Automatically remove the notification after 3 seconds
    setTimeout(() => {
      notificationElement.remove();
    }, 3000);
  }

  private getAlertClass(type: 'success' | 'error' | 'warning'): string {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-danger';
      case 'warning':
        return 'alert-warning';
      default:
        return 'alert-info'; // Default fallback, though not expected to be used
    }
  }

  private getBackgroundColor(type: 'success' | 'error' | 'warning'): string {
    switch (type) {
      case 'success':
        return '#006400'; // Deep green
      case 'error':
        return '#dc3545'; // Red
      case 'warning':
        return '#ffc107'; // Yellow
      default:
        return '#007bff'; // Blue for unknown type
    }
  }

  private createNotificationContainer(): void {
    if (!this.notificationContainer) {
      this.notificationContainer = document.createElement('div');
      this.notificationContainer.style.position = 'fixed';
      this.notificationContainer.style.top = '0'; // Position at the top
      this.notificationContainer.style.left = '0';
      this.notificationContainer.style.width = '100%';
      this.notificationContainer.style.zIndex = '1050';
      document.body.appendChild(this.notificationContainer);
    }
  }
}
