function PicketFence(opt){
let Path = '/assets/img/stock/';
if(opt.mobile){
		Path = '../stock/_';
}
let BData = {};
let SelectedSize = 75;
let SelectedMaterial = 'polyester';
let SelectedColor = '8017';
const PicketFenceSize = document.querySelector('.picket_fence_size h4');
const OpenDrawing = document.querySelector('.open_drawing');
const ImagePicketFence = document.querySelector('.image_picket_fence');
const Project = {
	Init: function () {
		this.LoadData();
		this.ModalOpen();
		this.SendOrder();
		this.MaskAll();
	},
	LoadData: function () {
		this.RequestData({ url: opt.json, request: 'GET' }, function (Data) {
			
			Project.GenerateColor(Data);
		});
	},
	GenerateColor: function (Data) {
		BData = Data;
		let Active = '';
		let GroupMaterials = '';
		let Material = '';
		let Materials = BData.materials;
		for (let key in Materials) {
			Material += '<div class="material">';
			Material += '<h6>' + Materials[key].title_matterial + '</h6>';
			Material += '<div class="group_colors">';
			for (let color in Materials[key].colors) {
				let part = Materials[key].colors[color];
				if (key == SelectedMaterial && color == SelectedColor) {
					Active = 'active';
				} else {
					Active = '';
				}
			Material += '<span class="' + Active + '" title="' + part.title_color + '" data-color="' + color + '" data-material="' + key + '" style="background-image: url('+ Path + part.miniature + ')"></span>';
			}
			Material += '</div>';
			Material += '</div>';
			GroupMaterials += Material;
			Material = '';
		}
		document.querySelector('.materials_group').insertAdjacentHTML('beforeend', GroupMaterials);
		Project.SelectSizeColor();
		Project.ChangeSize();
		Project.ChangeColor();
	},
	SelectSizeColor: function () {
		PicketFenceSize.innerHTML = BData[SelectedSize].title;
		OpenDrawing.dataset.drawing = Path + BData[SelectedSize].drawing;
		ImagePicketFence.style.backgroundImage = 'url('+ Path + BData.materials[SelectedMaterial].colors[SelectedColor][SelectedSize] + ')';
	},
	ChangeSize: function(){
		[].forEach.call(document.querySelectorAll('.container_image i'), function(el){
			el.addEventListener('click', function() {
			if(this.classList.contains('next_type')){
				SelectedSize === 75 ? SelectedSize += 25 : SelectedSize === 120 ? SelectedSize += 11 : SelectedSize += 10;
			}else{
				SelectedSize === 131 ? SelectedSize -= 11 : SelectedSize === 100 ? SelectedSize -= 25 : SelectedSize -= 10;
			}
			if(SelectedSize > 131){
				SelectedSize = 75;
			}else if(SelectedSize < 75){
				SelectedSize = 131;
			}
			Project.SelectSizeColor();
			});
		});
	},
	ChangeColor: function(){
		[].forEach.call(document.querySelectorAll('.group_colors span'), function(el){
			el.addEventListener('click', function() {
				SelectedMaterial = this.dataset.material;
				SelectedColor = this.dataset.color;
				[].forEach.call(document.querySelectorAll('.group_colors span'), function(color){
					color.classList.remove('active');
				});
				this.classList.add('active');
				Project.SelectSizeColor();
			});
		});
	},
	ModalOpen: function(){
		const ModalOverlay = document.querySelector('.modal_overlay');
		const ModalWindow = document.querySelector('.modal_window');
			[].forEach.call(document.querySelectorAll('.open_drawing,.open_picket_fence_form'), function(btn){
				btn.addEventListener('click', function() {
					if(this.classList.contains('open_drawing')){
						ModalWindow.style.backgroundImage = 'url('+this.dataset.drawing+')';
						ModalWindow.querySelector('form').style.display = 'none';
					}else if(this.classList.contains('open_picket_fence_form')){
						ModalWindow.style.backgroundImage = '';
						ModalWindow.querySelector('form').style.display = '';
					}
					setTimeout(function () {
						ModalOverlay.classList.add('open');
						ModalWindow.classList.add('open');
					}, 300);
				});
			});
			this.ModalClose(ModalOverlay, ModalWindow);
	},
	ModalClose: function(Overlay, Window){
		[].forEach.call(document.querySelectorAll('.modal_overlay,.modal_close'), function (el) {
			document.querySelector('.button_to_close').addEventListener('click', () => {
				Overlay.classList.remove('open');
				Window.classList.remove('open');
			})
			el.addEventListener('click', function (e) {
			if (e.target === this) {
			if (Overlay.classList.contains('open')) {
					Overlay.classList.remove('open');
					Window.classList.remove('open');
				}
			}
				});
			});
	},
	SendOrder: function() {
			document.getElementById('picket_fence_form').addEventListener('submit', function(e) {
				e.preventDefault();
				let Formdata = new FormData(this);
				let Message = this.querySelector('.recovery_message li small');
				let BtnSubmit = this.querySelector('[type="submit"]');
				BtnSubmit.disabled = true;

				Formdata.append('material', SelectedMaterial);
				Formdata.append('code_color', SelectedColor);
				Formdata.append('width', SelectedSize);
				Formdata.append('colors', true);
                fetch(opt.send, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title: Formdata.get('title'),
                        city: Formdata.get('city'),
                        name: Formdata.get('name'),
                        phone: Formdata.get('phone'),
                        material: Formdata.get('material'),
                        code_color: Formdata.get('code_color'),
                        width: Formdata.get('width'),
                        colors: true,
                    })
                })
                window.location.href = opt.thank + `?name=${Formdata.get('name')}`;
				// Project.RequestData({ url: opt.send, request: 'POST', data: Formdata }, function (data) {
				// 	if (data.send){
						
				// 	}
				// 	BtnSubmit.disabled = false;
				// });
					
			});
	},
	MaskAll: function () {
			[].forEach.call(document.querySelectorAll('input[data-mask]'), function (inputs) {
					['input', 'focus', 'blur', 'click'].forEach(function (events) {
							inputs.addEventListener(events, function (e) {
									let matrix = this.dataset.mask;
									let i = 0;
									let def = matrix.replace(/\D/g, "");
									let coun = matrix.replace(/\s+\_+/g, '');
									let val = this.value.replace(/\D/g, "");
									if (def.length >= val.length) {
											val = def
									}
									this.value = matrix.replace(/./g, function (a) {
											return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a;
									});
									if (e.type == 'focus' || e.type == 'click' ){
											this.selectionStart = this.value.length;
									}
									if (e.type == 'blur' && this.value.length != matrix.length ) {
											this.value = '';
											let span = this.nextElementSibling;
												!span.dataset.temp ? span.dataset.temp = span.innerHTML: null;
												span.innerHTML = 'Укажите телефон полностью';
													span.classList.add('error');
								setTimeout(function(){
												span.innerHTML = span.dataset.temp;
												span.classList.remove('error');
											},2000);
									}
							}, false);
					});
			});
	},
	RequestData: function(opt, callback) {
			let xhr = new XMLHttpRequest();
			xhr.open(opt.request, opt.url, true);
			xhr.send(opt.data);
			xhr.onload = function() {
					if (this.status >= 200 && this.status < 400) {
							if (this.response) {
								callback(JSON.parse(this.response));
							}
					}
			};
	}
};
Project.Init();
}

document.addEventListener('DOMContentLoaded', () => {
	setTimeout(() => {
		PicketFence({
			"email": "ofp.n@zmks.ru",
			"sebject": "Заказ штакетника",
			"thank": "/thanks",
			"json": "/colors",
			"send": "/bitrix",
			"mobile": false
		})
	}, 1000)
})
