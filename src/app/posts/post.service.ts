import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { postModel } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class postService {
  private posts: postModel[] = [];
  private postsChanged = new Subject<postModel[]>();
  postsCount: number;

  constructor(private http: HttpClient , private router: Router) {}

  getPosts(currentPage: number , pageSize: number) {
    const query = `?currentPage=${currentPage}&pageSize=${pageSize}`;

    this.http
      .get<{ message: string; posts: any[]; postsCount:number }>('http://localhost:3000/api/posts' + query)
      .pipe(
        map((postData) => {
          this.postsCount = postData.postsCount
          return postData.posts.map((post) => {
            return {
              title: post.title,
              body: post.body,
              id: post._id,
              imagePath: post.imagePath,
              creatorId: post.creatorId
            };
          });
        })
      )
      .subscribe((transformedData) => {
        this.posts = transformedData;
        this.postsChanged.next([...this.posts]);
      });
  }

  addPost(post: postModel) {
    const postData = new FormData();
      postData.append ("title" , post.title);
      postData.append ("body" , post.body);
      postData.append ("image" , post.imagePath , post.title);
    this.http
      .post<{ message: string , post: postModel }>('http://localhost:3000/api/posts', postData)
      .subscribe((Response) => {
        this.router.navigate(['/']);
        this.posts.push(post);
        this.postsChanged.next([...this.posts]);
      });
  }

  getPost (postId:string) {
    return this.http.get<{title:string ; body:string ; id:string , imagePath: string , creatorId: string}>('http://localhost:3000/api/posts/' + postId);
  }

  updatePost (postId:string , post: postModel , imagePath: File | string) {
    let postData: postModel | FormData;
    if (typeof(imagePath) === "object") {
      postData = new FormData();
      postData.append("title" , post.title);
      postData.append("id" , postId);
      postData.append("body" , post.body);
      postData.append("image" , imagePath , post.title);
    }
    else {
      postData = {
        id: postId,
        title: post.title,
        body: post.body,
        imagePath: imagePath,
        creatorId: null
      }
    }
    this.http.put('http://localhost:3000/api/posts/' + postId , postData).subscribe(response => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }

  getPostListener() {
    return this.postsChanged.asObservable();
  }
}
