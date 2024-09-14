.PHONY: push_and_update build push update tag_all tag_delete_all api

dir=$(shell pwd)
pack_mark=<publish-pack>
version_reg=[0-9]+\.[0-9]+\.[0-9]+
current_version:=$(shell grep -Eo "$(version_reg)" package.json -m 1)
i18n_version_reg=[0-9]+

define build_single
  @$(eval branch=$(shell git symbolic-ref --short -q HEAD))
	@echo -e "\033[44;37m$(1) current branch $(branch) is building......\033[0m"
	@cd ${dir}/../$(1) &&\
  git pull origin $(branch) && \
  git push && \
  RELEASE_VERSION=${current_version} npm run build 
  @echo -e "\033[40;32m$(1) build success ...... \033[0m"
endef

define tag_single
  @cd $(dir)/../$(1); \
  git tag $(2); \
  git push origin $(2)
endef

define tag_delete_single
  @cd $(dir)/../$(1) && \
  git push origin :refs/tags/$(2); \
  git tag --delete $(2)
endef

define tag_all
	echo 'none'
endef

define tag_delete_all
  @$(call tag_delete_single,web-components,$(1))
endef

push:
	@echo -e "\033[43;37m current version: $(current_version) \033[0m"
	@$(eval branch=$(shell git symbolic-ref --short -q HEAD))
	@read -p "Enter your commit message: " msg; \
	commit_msg=$$msg; \
	if echo $$commit_msg | grep -q "<publish-pack>"; then \
		version=$$(echo $$commit_msg | grep -oE $(version_reg)); \
		echo "new version is: $$version"; \
		sed -i -E 's/"version": "'$(version_reg)'"/"version": "'$$version'"/' ./package.json; \
    	make V=$$version tag_all; \
	fi; \
	git pull origin master; \
	git status; \
	git add .; \
	git commit -m "$$commit_msg"; \
	git push; \
	if echo $$commit_msg | grep -q "<publish-pack>"; then \
		version=$$(echo $$commit_msg | grep -oE $(version_reg));  \
		echo "new version is 1: $$version"; \
  		make tag_single DIR=web-components V=$$version; \
	fi;

build:
	@$(call build_single,web-components)


tag_all:
	@$(call tag_all,$(V))

tag_delete_all:
	@$(call tag_delete_all,$(DELETE_TAG))

tag_single:
	@$(call tag_single,$(DIR),$(V))
