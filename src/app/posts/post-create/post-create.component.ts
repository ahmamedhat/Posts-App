import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { postModel } from "../post.model";
import { postService } from "../post.service";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit{
  form: FormGroup;
  private mode = 0;
  private postId:string;
  post: postModel;
  isLoading = false;
  imageFile: string;


  constructor(private postService:postService , private router: ActivatedRoute) {

  }

  ngOnInit () {
    this.form = new FormGroup({
      title: new FormControl(null , { validators : [Validators.required , Validators.minLength(3)]}),
      body: new FormControl(null , {validators: Validators.required}),
      image: new FormControl(null , {validators: Validators.required , asyncValidators: mimeType})
    });
    this.isLoading = true;
    this.router.paramMap.subscribe(paramMap => {
      this.isLoading = false;
      if (paramMap.has('postId')) {
        this.mode = 1;
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId).subscribe(post => {
          this.post = post;
          this.form.setValue({
            title: this.post.title,
            body: this.post.body,
            image: this.post.imagePath
          });
        });
      }
      else {
        this.mode = 0;
        this.postId = null;
      }
    });
  }

  onUpload(event: Event){
    if (!(event.target as HTMLInputElement).files[0]) {
      return;
    }
    const image = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: image
    });
    this.form.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imageFile = (reader.result as string);
    };
    reader.readAsDataURL(image);
  }

  onSavePost(){
    if (this.form.invalid) {
      return;
    }

    if (this.mode === 0) {
      const post:postModel = {id: null , title: this.form.value.title , body: this.form.value.body , imagePath: this.form.value.image};
      this.postService.addPost(post);
    }
    else {
      const post:postModel = {id: this.postId , title: this.form.value.title , body: this.form.value.body , imagePath: this.form.value.image};
      this.postService.updatePost(this.postId , post , this.form.value.image);
    }

    this.isLoading = true;
    this.form.reset();

  }
}
