import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from 'app/authentication/notification.service';
import { LinkService } from 'app/services/firebase.link.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  selector: 'app-addlink',
  templateUrl: './add-link.component.html',
  styleUrls: ['./add-link.component.scss'],
})
export class AddLinkComponent implements OnInit {
  personName = '';
  socialMedia = '';
  socialMediaLink = '';
  isButtonEnabled: boolean = false; // Track if the button should be enabled
  isLinkValid: boolean = true; // To track if the entered link is valid
  maxLinksAllowed = 100;  // Maximum allowed links

  urlPattern: string = 'https?://(?:www\\.)?[a-zA-Z0-9-]+(?:\\.[a-zA-Z]{2,})+(?:/[^\\s]*)?';  // URL pattern to validate

  constructor(
    private linkService: LinkService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.checkLinkLimit();  // Check link limit when the page loads
  }

  // Enable button based on form validity
  checkFormValidity(): void {
    // Enable button if all required fields are filled and the link is valid
    this.isButtonEnabled = this.personName && this.socialMedia && this.socialMediaLink && this.isLinkValid ? true : false;
  }

  // Check if the entered URL is valid using the pattern
  validateLink(): void {
    const regex = new RegExp(this.urlPattern);
    this.isLinkValid = regex.test(this.socialMediaLink);

    if (!this.isLinkValid) {
      this.notificationService.showNotification('Please enter a valid URL.', 'warning');
    }
  }

  // Check if the user has already saved more than the allowed number of links
  async checkLinkLimit(): Promise<void> {
    try {
      const response = await this.linkService.fetchLinks();  // Await the promise
      const linkCount = response.length;  // Get the number of saved links
      if (linkCount >= this.maxLinksAllowed) {
        this.notificationService.showNotification('You have reached the maximum link limit. You cannot add more links.', 'warning');
        this.isButtonEnabled = false; // Disable the button permanently
      } else {
        this.isButtonEnabled = true; // Allow adding link if the limit is not reached
      }
    } catch (error) {
     // console.error('Error fetching links:', error);
      this.notificationService.showNotification('Error fetching links.', 'error');
    }
  }

  // Submit the form
  async onSubmit(form: any): Promise<void> {
    if (form.invalid || !this.isLinkValid || !this.isButtonEnabled) {
      //console.error('Form is invalid or URL is not valid or link limit exceeded');
      return;
    }

    const linkData = {
      personName: this.personName,
      socialMedia: this.socialMedia,
      socialMediaLink: this.socialMediaLink,
    };

    const isLinkAdded = await this.linkService.addLink(linkData);  // Get the success/failure status

    if (isLinkAdded) {
      this.notificationService.showNotification('Link added successfully', 'success');
    //  console.log('Link added successfully');
      this.router.navigate(['/home']);
    } else {
    ///  console.log('Failed to add link');
    }

    this.resetForm();
  }

  // Reset the form
  resetForm(): void {
    this.personName = '';
    this.socialMedia = '';
    this.socialMediaLink = '';
    this.isButtonEnabled = false; // Disable the button after reset
  }

  // Handle cancel action
  onCancel(): void {
    this.router.navigate(['/home']); // Navigate back to the home page
    this.resetForm(); // Reset form when cancel is clicked
  }
}
