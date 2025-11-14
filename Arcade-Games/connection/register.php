<?php

include 'connect.php';

if(isset($_POST['signup']))
{
  $name=$_POST['uname'];
  $email=$_POST['email'];
  $password=$_POST['pass'];

  $checkEmail="SELECT * From info where email='$email' ";
  $result=$conn->query($checkEmail);
  if($result->num_rows>0)
   {
     echo "<script>alert('Email Address Already Exists!')</script>";
     echo "<script>window.location.href='../register.html'</script>";
   }
  else
   {
     $insertQuery="INSERT INTO info(name,email,password) VALUES('$name','$email','$password')";
     if($conn->query($insertQuery)==TRUE)
        {
          echo "<script>alert('Registration Successfull')</script>";
          echo "<script>window.location.href='../index.html'</script>";
         }
     else
        {
          echo"Error:".$conn->error;
        }
    }
}

if(isset($_POST['login']))
{
  $email=$_POST['email'];
  $password=$_POST['password'];
 
  $sql="SELECT * FROM info WHERE email='$email' and password='$password' ";
  $result=$conn->query($sql);
  if($result->num_rows>0)
    {
      session_start();
      $row=$result->fetch_assoc();
      $SESSION['email']=$row['email'];
      header("Location: ../main.html");
      exit();
     }
    else
     {
       echo "<script>alert('Not Found, Incorrect email or password')</script>";
       echo "<script>window.location.href='../index.html'</script>";
   }
     
}
?>