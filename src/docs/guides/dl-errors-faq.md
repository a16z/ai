
# TensorFlow: Some Common Problems and Fixes

In this page we'll list some common issues when building tensorflow or the examples, and how to fix them. They are also identified by a code that our training script uses to identify sections more easily.

### <a name="inc_download"></a>Inception Download <small>(Code=inc_download)</small>

The Inception files can in some cases fail to download. Common causes are corporate firewalls, network errors, and so forth. If this step fails repeatedly you can download the file directly using a web browser from

[https://storage.googleapis.com/download.tensorflow.org/models/inception5h.zip](https://storage.googleapis.com/download.tensorflow.org/models/inception5h.zip)

and place it in the correct directory.

### <a name="inc_expand"></a>Inception Extraction <small>(Code=inc_expand)</small>

The extraction can fail if the directory specified already exists, or if permissions are incorrect. Deleting the directory (or renaming it) should fix this problem.

### <a name="custom_data_download"></a>Custom Dataset Download <small>(Code=custom_data_download)</small>

Common causes are corporate firewalls, network errors, and so forth. If this step fails repeatedly you can download the file directly using a web browser from

[http://localhost:5000/a16zset.zip](http://localhost:5000/a16zset.zip)

and place it in the correct directory.

### <a name="custom_data_expand"></a>Inception Extraction <small>(Code=custom_data_expand)</small>

The extraction can fail if the directory specified already exists, or if permissions are incorrect. Deleting the directory (or renaming it) should fix this problem.

### <a name="build_retrain"></a>Retraining (Build) <small>(Code=build_retrain)</small>

TBA

### <a name="run_retrain"></a>Retraining (Run) <small>(Code=run_retrain)</small>

TBA

### <a name="build_optimizer"></a>Optimizer (Build) <small>(Code=build_optimizer)</small>

TBA

### <a name="run_optimizer"></a>Optimizer (Run) <small>(Code=run_optimizer)</small>

TBA

### <a name="build_quantizer"></a>Quantize (Build) <small>(Code=build_quantizer)</small>

TBA

### <a name="build_quantizer"></a>Quantize (Run) <small>(Code=build_quantizer)</small>

TBA


### <a name="build_memmapping"></a>Memmapping (Build) <small>(Code=build_memmapping)</small>

TBA

### <a name="run_memmapping"></a>Memmapping (Run) <small>(Code=run_memmapping)</small>

TBA


### <a name="brew_bazel"></a>Homebrew & Bazel<small>(Code=brew_bazel)</small>

*Xcode version issues*

If you attempt to run brew commands with an older version of Xcode, you'll get a message like

```
$ brew upgrade
Error: Your Xcode (7.3.1) is too outdated.
Please update to Xcode 8.2 (or delete it).
Xcode can be updated from the App Store.
```

Therefore when running Homebrew commands you will need to use Xcode 8.2.

When running homebrew commands you might see the following error

*Homebrew link issue*

```bash
$ brew install automake
Warning: automake-1.15 already installed, its just not linked.
```

Typically this can be fixed by running

```bash
diego@polaris:~/tensorflow$ chmod 755 /usr/local/lib/pkgconfig
```

and then verifying everything now works as expected

```bash
diego@polaris:~/tensorflow$ brew link automake
Linking /usr/local/Cellar/automake/1.15... 113 symlinks created
```
