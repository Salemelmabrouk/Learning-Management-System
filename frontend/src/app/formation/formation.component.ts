import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';
import { AuthService } from '../auth.service';
import { BreadcrumbService } from 'src/services/breadcrumb.service';

interface User {
  role: string;
  wishlist: string[];
 
}

@Component({
  selector: 'app-formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.css']
})

export class FormationComponent implements OnInit {
  user!: User;
  public mydate: Date = new Date();
  public formations: any[] = [];
  public Role: string = '';
  public token: string | null = '';
  public errorMessage: string = '';
  public currentPage: number = 1;
  public totalPages: number = 5;
  isHovered: boolean = false;
  public sortBy: string = 'name'; // Default sorting
  public order: 'asc' | 'desc' = 'asc'; // Default sorting order
  public filters: { [key: string]: string } = {}; // Filters if needed
  public starSize: number = 24;
  public page: number;
  public limit: number;
  formationDetails: any = {};
  breadcrumbs: any[]=[];
 
  wishlist: string[] = [];
  us: any;
  isInteger(value: number): boolean {
    return Number.isInteger(value);
  }

  optionsAbbrev: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
  public hoveredIndex: number | null = null;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: ApiserviceService,
    private authService: AuthService,
    private breadcrumbService: BreadcrumbService
  ) {}

  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.page = +params['page'] || 1; // Default to page 1
      this.limit = +params['limit'] || 10; // Default to limit 10
      this.getAllFormations();
    });
    this.isSidebarVisible = window.innerWidth >= 992;
    this.breadcrumbService.getBreadcrumbs().subscribe(breadcrumbs => {
      this.breadcrumbs = breadcrumbs;
    });
    this.loadWishlist();
  }

  formatDay(date: Date): string {
    if (!(date instanceof Date)) {
      date = new Date(date); // Convert to Date if it's a string
    }
    return String(date.getDate()).padStart(2, '0'); // Format day as two digits
  }
  timeAgo(date: Date) {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + ' years ago';
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + ' months ago';
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + ' days ago';
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + ' hours ago';
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + ' minutes ago';
    }
    return 'Just now';
  }
  
  formatMonth(date: Date): string {
    if (!(date instanceof Date)) {
      date = new Date(date); // Convert to Date if it's a string
    }
    return date.toLocaleString('default', { month: 'short' }).toUpperCase(); // Format month to abbreviation
  }
  toggleDescription(index: number, isHovering: boolean) {
    this.hoveredIndex = isHovering ? index : null; // Set the index when hovering, clear when not
  }
  // Fetch all formations with pagination
  getAllFormations() {
    this.service.get_all_formation(this.currentPage).subscribe({
      next: (res: any) => {
        console.log('Fetched formations:', res);
        this.formations = res.trainings.map((formation: any) => {
          console.log('Formation ID:', formation._id);
          // Format the startDate for each formation
          if (formation.startDate && typeof formation.startDate === 'string') {
            formation.startDate = new Date(formation.startDate);
            formation.formattedStartDate = formation.startDate.toLocaleDateString('en-GB', this.optionsAbbrev).toUpperCase();
          }
  
          // Add review count and last review time
          formation.reviewCount = formation.reviews.length;
          if (formation.reviews.length > 0) {
            // Sort reviews by createdAt and get the latest one
            const latestReview = formation.reviews.reduce((a: any, b: any) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b);
            formation.lastReviewTime = this.timeAgo(new Date(latestReview.createdAt));
          } else {
            formation.lastReviewTime = 'No reviews yet';
          }

          // Check if the formation is in the wishlist
          formation.isInWishlist = this.wishlist.includes(formation._id); // Add the wishlist status to the formation object

          return formation;
        });
        this.totalPages = res.totalPages; // Update total pages based on response
        console.log('Formations:', this.formations);
      },
      error: (error) => {
        console.error('Error fetching formations:', error);
        this.errorMessage = 'Error fetching formations.';
      }
    });
  }
  getLastCommentTimeAgo(reviews: any[]): string {
    if (reviews.length === 0) return "No comments yet";

    const lastReview = reviews[reviews.length - 1]; // Get the most recent review
    return this.timeAgo(new Date(lastReview.createdAt)); // Use the timeAgo function
}
  // Change page function to handle page navigation
  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: page, limit: this.limit },
        queryParamsHandling: 'merge', // To keep other existing query params
      });
      this.currentPage = page; // Update currentPage here after navigation
    }
  }

  fetchFormationDetails(id: string): void {
    this.service.get_formation_by_ID(id).subscribe(
        (data) => {
            this.formationDetails = data;

            // Check if startDate exists and is a string
            if (data.startDate && typeof data.startDate === 'string') {
                const startDate = new Date(data.startDate);
                const formattedDateAbbrev = startDate.toLocaleDateString('en-GB', this.optionsAbbrev).toUpperCase();
                console.log(formattedDateAbbrev);
            }

            console.log(this.formationDetails); // Check the fetched data
        },
        (error) => {
            this.errorMessage = 'Failed to load formation details.';
        }
    );
}
applyFilter(filter: string): void {
  console.log(`Filter applied: ${filter}`);
  // Implement the filter logic here, such as updating the formations array
  if (filter === 'rating') {
    this.formations = this.formations.sort((a, b) => b.rating - a.rating);
  } else if (filter === 'place') {
    this.formations = this.formations.filter(formation => formation.place === 'Specific Place');
  } else if (filter === 'date') {
    this.formations = this.formations.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }
}
isSidebarVisible: boolean = true;

toggleSidebar(): void {
  this.isSidebarVisible = !this.isSidebarVisible;
}

 

  // Fetch formation by ID
  getFormationById(id: string): void {
    this.service.get_formation_by_ID(id).subscribe({
      next: (res: any) => {
        console.log('Formation details:', res);
        this.formationDetails = res; // Store the formation details

        this.Role = res.Role; // Assuming `Role` is a property in the response
      },
      error: (error) => {
        this.errorMessage = 'Error fetching formation details.';
        console.error('Error fetching formation by ID:', error);
      }
    });
  }

  // Assign a participant to a formation
  assignParticipant(formationId: string) {
    const participantId = this.authService.getUserId(); // Assuming this method returns the current user ID
    if (participantId) {
      this.service.assignParticipantToFormation(formationId, participantId).subscribe({
        next: (response) => {
          console.log('Participant assigned successfully', response);
        },
        error: (error) => {
          this.errorMessage = 'Error assigning participant.';
          console.error('Error assigning participant:', error);
        }
      });
    } else {
      this.errorMessage = 'No participant ID found.';
    }
  }

  // Navigate to feedback page
  gotofeedback() {
    this.router.navigate(['/feedback']);
  }

  // Submit feedback for a formation
  submitFeedback(formation: any): void {
    const feedbackData = {
      rating: formation.rating,
      feedback: formation.feedback,
    };

    this.service.create_feedback(feedbackData).subscribe({
      next: (response) => {
        console.log('Feedback submitted successfully:', response);
      },
      error: (error) => {
        this.errorMessage = 'Error submitting feedback.';
        console.error('Error submitting feedback:', error);
      }
    });
  }

  // Check if today's date matches the formation's end date
  isTodayEndDate(endDate: string): boolean {
    const today = new Date();
    const end = new Date(endDate);
    return today.toDateString() === end.toDateString();
  }

  // Set sorting criteria and fetch formations accordingly
  setSorting(sortBy: string) {
    this.sortBy = sortBy;
    this.order = this.order === 'asc' ? 'desc' : 'asc'; // Toggle sorting order
    this.getAllFormations(); // Fetch sorted data
  }
  fetchUserDetails() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.service.getUserDetails(userId).subscribe((userData: User) => {
        this.user = userData; // Initialize the user property
      }, error => {
        console.error('Failed to fetch user details:', error);
      });
    }
  }
  
  isInWishlist(formationId: string): boolean {
    return this.user && this.user.wishlist && this.user.wishlist.includes(formationId);
}

  

  loadWishlist() {
    this.service.getWishlist().subscribe({
      next: (response: any) => {
        if (response.wishlist) {
          this.wishlist = response.wishlist.map((formation: any) => formation._id); // Assuming formation has an _id field
          // After loading the wishlist, we can check if formations are in the wishlist
       
        }
      },
      error: (err) => {
        console.error('Error loading wishlist:', err);
      }
    });
  }

  
  checkFormationInWishlist(formationId: string): boolean {
    return this.user?.wishlist && this.user.wishlist.includes(formationId);
  }

  toggleWishlist(formationId: string): void {
    // First, check if the formation is already in the wishlist
    const formation = this.formations.find(f => f._id === formationId);
    
    if (!formation) {
      console.error('Formation not found');
      return;
    }
    
    if (formation.isInWishlist) {
      // If the formation is in the wishlist, call removeFromWishlist
      this.service.removeFromWishlist(formationId).subscribe(
        (res) => {
          console.log('Removed from Wishlist:', res);
          formation.isInWishlist = false; // Update the formation's wishlist status
        },
        (err) => {
          console.error('Error removing from wishlist:', err);
        }
      );
    } else {
      // If the formation is not in the wishlist, call addToWishlist
      this.service.addToWishlist(formationId).subscribe(
        (res) => {
          console.log('Added to Wishlist:', res);
          formation.isInWishlist = true; // Update the formation's wishlist status
        },
        (err) => {
          console.error('Error adding to wishlist:', err);
        }
      );
    }
  }
  
  


  addToWishlist(formationId: string): void {
    this.service.addToWishlist(formationId).subscribe(
      (response) => {
        console.log('Added to wishlist:', response);
        // Optionally refresh the wishlist state or update the UI
      },
      (error) => {
        console.error('Error adding to wishlist:', error);
      }
    );
  }
  
  removeFromWishlist(formationId: string): void {
    this.service.removeFromWishlist(formationId).subscribe(
      (response) => {
        console.log('Removed from wishlist:', response);
        // Optionally refresh the wishlist state or update the UI
      },
      (error) => {
        console.error('Error removing from wishlist:', error);
      }
    );
  }
  
}
