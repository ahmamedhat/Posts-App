import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { authService } from "src/app/auth/auth.service";
import { postModel } from "../post.model";
import { postService } from "../post.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class postListComponent implements OnInit, OnDestroy{

  constructor(private postService:postService , private authService: authService){

  }

  posts:postModel[] = [];
  sub:Subscription;
  sub2:Subscription;
  isLoading = false;
  pageSize = 1;
  currentPage = 1;
  totalPosts: number;
  pageSizeOptions = [1 , 2 , 5, 10];
  isAuthenticated: boolean;
  userId: string;

  ngOnInit() {
    this.isLoading = true;
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.userId = this.authService.getUserId();
    this.postService.getPosts(this.pageSize , this.currentPage);
    this.totalPosts = this.postService.postsCount;
    this.sub = this.postService.getPostListener().subscribe((posts:postModel[]) => {
      this.isLoading = false;
      this.posts = posts;
      this.totalPosts = this.postService.postsCount;
    });
    this.sub2 = this.authService.getAuthenticationStatus().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.currentPage , this.pageSize);
      this.isLoading = false;
    });;
  }

  onPageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.postService.getPosts(this.currentPage , this.pageSize);
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }
}
