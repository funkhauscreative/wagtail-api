import axios from 'axios';

import { APIModel, TranslatableAPIModel, PagesAPIModel, SnippetAPIModel } from './model.mjs';


class WagtailAPI {
	constructor(app, config) {
		this.config = config;
		this.app = app;
		this.$axios = axios.create({
			baseURL: this.config.wagtailURL + "/api/v2/"
		});

		this.pages = new PagesAPIModel("pages", this);
		this.documents = new APIModel("documents", this);
		this.images = new APIModel("images", this);
		this.blocks = new SnippetAPIModel("blocks", this);
		this.menus = new SnippetAPIModel("menus", this);
		this.settings = new APIModel("settings", this);
		this.form = new APIModel("forms", this);

		// requires torchbox/wagtail-headless-preview to be configured in wagtail
		this.preview = new APIModel("preview", this);
	}

	addSnippetEndpoint(name) {
		this[name] = new SnippetAPIModel(name, this);
	}

	static install(Vue, options = {}) {
		Vue.config.globalProperties.$wagtail = new WagtailAPI(Vue, options);
	}
}


export default WagtailAPI;