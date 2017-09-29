<h2>我的git操作大全</h2>

创建版本库：``` git init  ```   

添加远程仓库： ``` git remote add origin git@github.com:WenXuanHe/underscore-copy-.git  ```

查看git项目配置信息：``` git config -e  ```

查看远程仓库信息： ``` git remote -v  ```

重命名文件：```git mv read.md readme.md  ```

忽略：```.gitignore  ```

为分支改名：```git branch -m master mymaster  ```

###合并
普通合并：```git merge branchname  ```

压合提交：```git merge branchname --squash ```  把该分支下所有的提交都一次合并  

捡选合并：```git cherry-pick 唯一提交名称 ```（可通过git reflog 查看）  

<h5>拣选合并多个提交</h5>
>  1. git cherry-pick name -n 
   2. git cherry-pick name -n  
   3. git cherry-pick name -n  
   4. git commit

<h3>关于分支</h3>

<h5>新建分支并切换</h5>

  >新建分支：``` git branch branchName ```

  >切换分支: ``` git checkout branchName```

  也可以使用合并的方式：```git chekcout –b branchName ```


展示所有分支：``` git branch -a ```

拉取远程仓库的数据： ``` git fetch ```

拉取远程分支信息以及合并： ```git pull ```

<h3>关于提交</h3>

查看本地修改文件： ```git status ```

添加到索引库： ``` git add -A  ```

提交到暂存区： ``` git commit -m "test:eslint" ``` -m 中是每次提交的描述

提交到远程: ``` git push origin branchName:branchName ```

追加提交：
  > 1. 补交到最后一次 ``` git commit --amend ``` 
  > 2. 强制提交 ``` git push -f origin branchName1```  

<h3>rebase基本步骤 </h3>

切换到需要rebase的分支： ``` git checkout branchName1 ```  

更新分支：``` git pull ```  

再切换到当前分支：``` git checkout branchName2 ```

rebase: ``` git rebase branchName1   ```

强制提交到远程仓库: ``` git push origin branchName1 -f   ```

<h3>回滚</h3>

文件a没有被添加到索引区： ``` git checkout a```

文件已被添加到索引区, 或commit：
  > 1. ```git reflog ```//找到索引
  > 2. ```git reset HEAD 索引 a文件 ```
  > 3. ``` git checkout a ```

<h3>和删除有关</h3>

删除一些没有add操作的文件： ``` git clean -df ```

移除早已删除的远程分支： ```git remote prune ```

<h5>删除分支</h5>

  >删除本地：```git branch -D branchName ```

  >删除远程：``` git push origin  :origin-branchName ```
