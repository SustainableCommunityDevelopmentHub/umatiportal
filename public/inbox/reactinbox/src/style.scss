@import "compass";

// Fonts
@import url(https://fonts.googleapis.com/css?family=Open+Sans:400,300,600);
$font-base: 'Open Sans', Arial, sans-serif;

$blue-1: #009fc4;
$blue-2: #0c7ead;

*, *:before, *:after {
	box-sizing: border-box;
}

body {
	background: #eee;
	font-family: $font-base;
	font-size: 14px;
	line-height: 150%;
}

.truncate {
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	width: 100%;
}

.disclaimer {
	margin: 0 auto 50px;;
	text-align: center;
	width: 400px;
}

// Buttons
.btn {
	border: none;
	cursor: pointer;
	display: block;
	font-family: $font-base;
	font-size: 16px;
	outline: none;
	padding: 15px;
	transition: all .1s linear;
}

// Inbox wrapper
$app-height: 500px;
$sidebar-width: 200px;

.wrapper {
	box-shadow: 0 4px 20px rgba(51, 51, 51, .2);
	margin: 50px auto;
	overflow: auto;
	width: 1024px;
	
	.inbox-container {
		float: left;
		height: $app-height;
		width: calc(100% - #{$sidebar-width});
	}
}

#sidebar {
	background: #34393d;
	float: left;
	height: $app-height;
	width: $sidebar-width;
	
	.sidebar__inboxes {
		margin-top: 50px;
		
		.item-count {
			background: #34393d;
			border-radius: 5px;
			float: right;
			padding: 2px 8px;
			margin: -2px -8px;
		}
		
		li a {
			color: #fff;
			cursor: pointer;
			display: block;
			margin-bottom: 10px;
			padding: 15px;
			text-decoration: none;
			transition: background .1s linear;
			width: 100%;
			
			&:hover {
				background: #404549;
			}
		}
		
		.fa {
			margin-right: 10px;
		}
	}
	
	.btn.compose {
		color: #fff;
		padding: 30px 15px;
		text-align: center;
		text-decoration: none;
		transition: all .1s linear;
		width: 100%;
		@include background-image(linear-gradient(bottom right, $blue-1, $blue-2));
		
		&:hover {
			background-size: 150%;
			
			.fa {
				-webkit-transform: rotate(90deg);
				-ms-transform: rotate(90deg);
				transform: rotate(90deg);
			}
		}
		
		.fa {
			margin-left: 10px;
			transition: all .1s linear;
		}
	}
}

// Email list
.email-list {
	background: #f5f5f5;
	float: left;
	height: $app-height;
	max-height: 100%;
	overflow-y: auto;
	width: 35%;
	
	&.empty {
		color: #aaa;
		padding-top: 200px;
		text-align: center;
	}
	
	.email-item {
		background: #fff;
		border-bottom: 1px solid #eee;
		cursor: pointer;
		padding: 10px 15px;
		position: relative;
		
		&.selected {
			color: $blue-1;
		}
		
		&__subject {
			margin-bottom: 8px;
		}
		
		&__details {
			font-size: 12px;
			opacity: .5;
			text-transform: uppercase;
		}
		
		&__unread-dot {
			height: 100%;
			right: 10px;
			position: absolute;
			top: 10px;
			
			&[data-read="false"]:before {
				background: $blue-1;
				border-radius: 50%;
				content: '';
				display: block;
				height: 6px;
				width: 6px;
			}
		}
		
		&__time {
			float: right;
			text-align: right;
			width: 40%;
		}
		
		&__from.truncate {
			width: 60%;
		}
		
		&:hover:not(.selected) {
			background: #fafafa;
		}
	}
}

// Email content
.email-content {
	background: #fff;
	border-left: 1px solid #ddd;
	float: left;
	height: $app-height;
	position: relative;
	width: 65%;
	
	&__header {
		background: #f5f5f5;
		border-bottom: 1px solid #eee;
		padding: 10px 15px;
	}
	
	&__subject {
		font-size: 18px;
		margin: 10px 0;
	}

	&__details {
		font-size: 12px;
		opacity: .5;
		text-transform: uppercase;
	}

	&__time {
		color: #878787;
		float: right;
	}

	&__from {
		color: #878787;
	}
	
	&__message {
		padding: 20px 15px 15px;
	}
	
	.delete-btn {
		cursor: pointer;
		margin: -5px;
		padding: 5px;
		position: absolute;
		right: 20px;
		top: 24px;
		transition: color .1s linear;
		
		&:hover {
			color: #E23E57;
		}
	}
}

// Footer
.footer {
	background: #f5f5f5;
	border-top: 1px solid #ddd;
	color: #999;
	clear: both;
	font-size: 14px;
	padding: 10px;
	text-align: center;
	width: 100%;
}