// src/app/home/home.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { user } from '@angular/fire/auth';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LinkService } from 'app/services/firebase.link.service';
import { LoginService } from 'app/services/firebase.login.service';
import { FirebaseService } from 'app/services/firebase.service';
// import { LinkService } from 'app/services/firebase.link.service';
// import { LoginService } from 'app/services/firebase.login.service';
// import { LinkService } from '../link.servkcice'; // Import LinkService
import { throwError } from 'rxjs';
import Swal from 'sweetalert2'; 
// import { LinkService1 } from '../link.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dataLoaded = false;
  selectedSocialMedia: string = '';
  // filteredSocialMediaList: any[] = [];
  socialMediaList: any[] = []; // Initialize empty array to hold social media records
  username: string | null = null;
  //isLoggedIn: boolean = false; 
  constructor(private linkService: LinkService, 
    private loginServcie: LoginService,
    private route: ActivatedRoute,
    private firebaseService: LinkService) {

  }  // Inject LinkService

  ngOnInit(): void {
   // this.route.data.subscribe((data) => {
    //console.log("from link");
      this.fetchLinks();     
      this.loadData();
 // })
  
}

  async fetchLinks(): Promise<void> {
    try {      
     //console.log("from home fetch linked");
        const links = await this.linkService.fetchLinks();
        setTimeout(() => {
        this.socialMediaList = links;
        this.dataLoaded = true;
      }, 1); 
     // } // Assign the fetched links to socialMediaList
    } catch (error) {
     // console.error('Error fetching links:', error);
    }
  }

  loadData(): void {
    //console.log('Fetching data from Firebase...');
    this.firebaseService.getRecords().subscribe(
      (records) => {
       // console.log('Data loaded:', records);  // Log the fetched data
        this.socialMediaList = records;
        this.dataLoaded = true;
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.dataLoaded = false;
      }
    );
  }
  filterSocialMedia(): void {
    if (this.selectedSocialMedia) {
      this.socialMediaList = this.socialMediaList.filter(
        (record) => record.socialMedia === this.selectedSocialMedia
      );
    } else {
      this.socialMediaList = [...this.socialMediaList]; // Show all if no filter is selected
    }
  }
  
  deleteRecord(record: any) {
    // Optimistically remove the record from the UI
    this.socialMediaList = this.socialMediaList.filter(item => item.id !== record.id);
    
    // Perform delete operation
    this.firebaseService.deleteRecord(record.id)
      .then(() => {
        // Optionally show a success message or nothing at all
      })
      .catch(error => {
        // Handle error (maybe revert the UI change or show an error message)
        console.error(error);
      });
  }
  
  trackById(index: number, record: any): any {
    return record.id; // This helps Angular track each row uniquely by the record's ID
  }
  
  
}  