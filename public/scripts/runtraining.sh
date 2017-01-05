#!/bin/bash

TARGET_ROOT_FOLDER=/Users/joe

TF_DATA=$TARGET_ROOT_FOLDER/tf_files
TF_CMD_LOGS=$TARGET_ROOT_FOLDER/tf_files/command_logs
TF_BIN=$TARGET_ROOT_FOLDER/tensorflow
SCRIPT_VERSION=v1.0

# prefix used to make output files unique
TF_PREFIX=a16z

# Dataset download URL is independent of any other variables
TF_CUSTOM_DATASET_ZIP_URL=http://cryptic-alpha.herokuapp.com/a16zset.zip
ERROR_FAQ_URL=https://cryptic-alpha.herokuapp.com/docs/guides/dl-errors-faq

# this is the name that will be given to the dataset on download and for the expanded data set directory
TF_CUSTOM_DATASET_NAME=a16zset

# colors for printf
BLACK=$(tput setaf 0)
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
LIME_YELLOW=$(tput setaf 190)
POWDER_BLUE=$(tput setaf 153)
BLUE=$(tput setaf 4)
MAGENTA=$(tput setaf 5)
CYAN=$(tput setaf 6)
WHITE=$(tput setaf 7)
BRIGHT=$(tput bold)
NORMAL=$(tput sgr0)
BLINK=$(tput blink)
REVERSE=$(tput smso)
UNDERLINE=$(tput smul)

######## SCRIPT FUNCTIONS

# Runs command and check for exit code
# first parameter = command to run
# second param = output to err and out prefix path
# third param = message to print before running
# fourth param = message printed when cmd exited with code 0 (ok)
# fifth param = if the command exits with error
#       (ie exit code != 0) message to print
# sixth param =  'code' to print for error
function runAndCheckCMD () {
    #$2 is something like $TF_CMD_LOGS/$CUR_STEP or /Users/joe/tf/logs
    CMD_ARRAY=( $1 )
    CMD_TO_RUN="$1 > $2-out.txt 2> $2-err.txt"
    RUN_MSG=$3
    OK_MSG=$4
    ERR_MSG=$5
    ERR_CODE=$6
    CMD_BASE=${CMD_ARRAY[0]}
    cmd_start_sec=$SECONDS
    echo -n "$RUN_MSG..."
    eval "$CMD_TO_RUN"
    CMD_EXIT_CODE=$?
    cmd_end_sec=$SECONDS
    duration=$(($cmd_end_sec - $cmd_start_sec))
    duration_min=$(($duration / 60))
    duration_sec=$(($duration % 60))
    if [ $CMD_EXIT_CODE -eq 0 ]
    then
      printf "done. (%dm %ds)\n" "$duration_min" "$duration_sec"
      printf "${BLUE}%s${NORMAL}\n" "$OK_MSG"
    else
      printf "\n\n\n${RED}Error when running:${NORMAL}"
      printf "\n\n%s" "$CMD_TO_RUN"
      printf "\n\n${RED}Exit code was ${NORMAL}${BRIGHT}%s${NORMAL}" "$CMD_EXIT_CODE"
      if [ $CMD_EXIT_CODE -eq 126 ]
      then
        printf "\n${RED}This exit code means that the command invoked ("${YELLOW}%s${RED}") cannot execute.${NORMAL} Please check that the command is available.\n\n" "$CMD_BASE"
        exit 126
      fi
      if [ $CMD_EXIT_CODE -eq 127 ]
      then
        printf "\n${RED}This exit code means that the command invoked ("${YELLOW}%s${RED}") cannot be found.${NORMAL} Please check that the command is available.\n\n" "$CMD_BASE"
        exit 127
      fi
      printf "\n${RED}Failed after %dm %ds." "$duration_min" "$duration_sec"
      printf "\n${RED}Message: ${NORMAL}${BRIGHT}%s${NORMAL}" "$ERR_MSG"
      printf "\n${RED}Error code: ${NORMAL}${BRIGHT}%s${NORMAL}\n\n" "$ERR_CODE"
      exit 1
    fi
}


if [ ! -d "$TARGET_ROOT_FOLDER" ]; then
  # Control will enter here if TARGET_ROOT_FOLDER doesn't exist.
  echo "Target directory $TARGET_ROOT_FOLDER does not exist. Exiting."
  exit
fi

printf "\n${BLUE}TensorFlow retraining script %s.${NORMAL}\n\nRoot folder for the installation will be ${BRIGHT}[%s]${NORMAL}.\n\n" "$SCRIPT_VERSION" "$TARGET_ROOT_FOLDER"

if [ ! -d "$TF_DATA" ]; then
  printf "Creating ${BRIGHT}[%s]${NORMAL}...\n" "$TF_DATA"
  mkdir -p $TF_DATA
	printf "done.\n"
else
	printf "Folder ${BRIGHT}[%s]${NORMAL} exists. Continuing.\n" "$TF_DATA"
fi

printf "TensorFlow data will be under ${BRIGHT}[%s]${NORMAL}\n" "$TF_DATA"


mkdir -p $TF_CMD_LOGS
# remove logfiles from previous runs to avoid confusion
rm -f $TF_CMD_LOGS/*_err.txt
rm -f $TF_CMD_LOGS/*_out.txt

printf "Logs for all commands run will be under ${BRIGHT}[%s]${NORMAL}.\n" "$TF_CMD_LOGS"


if [ ! -d "$TF_BIN" ]; then
    printf "Creating ${BRIGHT}[%s]${NORMAL}...\n" "$TF_BIN"
  mkdir -p $TF_BIN
  printf "done.\n"
else
    printf "Folder ${BRIGHT}[%s]${NORMAL} exists. Continuing.\n" "$TF_BIN"
fi

printf "TensorFlow binaries will be under ${BRIGHT}[%s]${NORMAL}\n" "$TF_BIN"

cd $TF_BIN || exit

printf "Changed directory to ${BRIGHT}[%s]${NORMAL}\n\n\n" "$PWD"

SCRIPT_START_SECONDS=$SECONDS

printf "${BLUE}Starting process.${NORMAL}\n\n"

########### STEP 0 - Check for data files, download and expand if necessary

if [ ! -d $TF_DATA/inception  ]; then

    if [ ! -f $TF_DATA/inception.zip  ]; then

        CUR_STEP=inc_download

        cmd_step="curl -o $TF_DATA/inception.zip https://storage.googleapis.com/download.tensorflow.org/models/inception5h.zip"
        cmd_log_path=$TF_CMD_LOGS/$CUR_STEP
        cmd_msg="Inception data zip not found, downloading..."
        cmd_ok_msg="Inception data downloaded."
        cmd_err_msg="Error downloading inception data, check $ERROR_FAQ_URL#$CUR_STEP for more."
        cmd_err_code=$CUR_STEP
        runAndCheckCMD "$cmd_step" "$cmd_log_path" "$cmd_msg" "$cmd_ok_msg" "$cmd_err_msg" "$cmd_err_code"
    fi

    CUR_STEP=inc_expand

    cmd_step="unzip $TF_DATA/inception.zip -d $TF_DATA/inception > $TF_CMD_LOGS/$CUR_STEP-out.txt 2> $TF_CMD_LOGS/$CUR_STEP-err.txt"
    cmd_log_path=$TF_CMD_LOGS/$CUR_STEP
    cmd_msg="Expanding inception data..."
    cmd_ok_msg="Inception data extracted."
    cmd_err_msg="Error expanding data. Check if the ZIP file downloaded is valid at $TF_DATA/inception.zip, or check $ERROR_FAQ_URL#$CUR_STEP for more."
    cmd_err_code=$CUR_STEP
    runAndCheckCMD "$cmd_step" "$cmd_log_path" "$cmd_msg" "$cmd_ok_msg" "$cmd_err_msg" "$cmd_err_code"

    # make sure the expanded inception data has the correct permissions
    chmod 666 $TF_DATA/inception/*

fi

INCEPTION_DATASET_FOLDER=$TF_DATA/inception

printf "${BLUE}Inception dataset ready at ${BRIGHT}[%s]${NORMAL}\n" "$INCEPTION_DATASET_FOLDER"

if [ ! -d $TF_DATA/$TF_CUSTOM_DATASET_NAME  ]; then


    if [ ! -f $TF_DATA/$TF_CUSTOM_DATASET_NAME.zip  ]; then

        CUR_STEP=custom_data_download

        cmd_step="curl -o $TF_DATA/$TF_CUSTOM_DATASET_NAME.zip $TF_CUSTOM_DATASET_ZIP_URL"
        cmd_log_path=$TF_CMD_LOGS/$CUR_STEP
        cmd_msg="Custom dataset zip not found, downloading..."
        cmd_ok_msg="Custom dataset downloaded."
        cmd_err_msg="Error custom dataset, check $ERROR_FAQ_URL#$CUR_STEP for more."
        cmd_err_code=$CUR_STEP
        runAndCheckCMD "$cmd_step" "$cmd_log_path" "$cmd_msg" "$cmd_ok_msg" "$cmd_err_msg" "$cmd_err_code"
    fi

    CUR_STEP=custom_data_expand

    cmd_step="unzip $TF_DATA/$TF_CUSTOM_DATASET_NAME.zip -d $TF_DATA/$TF_CUSTOM_DATASET_NAME"
    cmd_log_path=$TF_CMD_LOGS/$CUR_STEP
    cmd_msg="Custom dataset zip not found, downloading..."
    cmd_ok_msg="Custom dataset downloaded."
    cmd_err_msg="Error custom dataset, check $ERROR_FAQ_URL#$CUR_STEP for more."
    cmd_err_code=$CUR_STEP
    runAndCheckCMD "$cmd_step" "$cmd_log_path" "$cmd_msg" "$cmd_ok_msg" "$cmd_err_msg" "$cmd_err_code"

fi

CUSTOM_DATASET_FOLDER=$TF_DATA/$TF_CUSTOM_DATASET_NAME

printf "${BLUE}Custom dataset ready at ${BRIGHT}[%s]${NORMAL}\n" "$CUSTOM_DATASET_FOLDER"

########### PART 1 - Retraining

if [ ! -f bazel-bin/tensorflow/examples/image_retraining/retrain  ]; then

    CUR_STEP=build_retrain

    cmd_step="bazel build tensorflow/examples/image_retraining:retrain"
    cmd_log_path=$TF_CMD_LOGS/$CUR_STEP
    cmd_msg="Image retraining bazel bin not found. This step can take 30+ minutes. Building..."
    cmd_ok_msg="image_retraining:retrain build complete."
    cmd_err_msg="Error building image_retraining:retrain, check $ERROR_FAQ_URL#$CUR_STEP for more."
    cmd_err_code=$CUR_STEP
    runAndCheckCMD "$cmd_step" "$cmd_log_path" "$cmd_msg" "$cmd_ok_msg" "$cmd_err_msg" "$cmd_err_code"

fi

CUR_STEP=run_retrain


cmd_step="bazel-bin/tensorflow/examples/image_retraining/retrain --bottleneck_dir=$TF_DATA/$TF_PREFIX-bottlenecks --model_dir=$INCEPTION_DATASET_FOLDER --output_graph=$TF_DATA/$TF_PREFIX-retrained_graph.pb --output_labels=$TF_DATA/$TF_PREFIX-retrained_labels.txt --image_dir $CUSTOM_DATASET_FOLDER"
cmd_log_path=$TF_CMD_LOGS/$CUR_STEP
cmd_msg="This step can take 45+ minutes. Retraining..."
cmd_ok_msg="Retraining complete."
cmd_err_msg="Error retraining, check $ERROR_FAQ_URL#$CUR_STEP for more."
cmd_err_code=$CUR_STEP
runAndCheckCMD "$cmd_step" "$cmd_log_path" "$cmd_msg" "$cmd_ok_msg" "$cmd_err_msg" "$cmd_err_code"


########### STEP 2 - Optimize for Inference

if [ ! -f bazel-bin/tensorflow/python/tools/optimize_for_inference  ]; then

    CUR_STEP=build_optimizer

    cmd_step="bazel build tensorflow/python/tools:optimize_for_inference"
    cmd_log_path=$TF_CMD_LOGS/$CUR_STEP
    cmd_msg="Optimizer bazel bin not found. Building..."
    cmd_ok_msg="tools/optimize_for_inference build complete."
    cmd_err_msg="Error building optimize_for_inference, check $ERROR_FAQ_URL#$CUR_STEP for more."
    cmd_err_code=$CUR_STEP
    runAndCheckCMD "$cmd_step" "$cmd_log_path" "$cmd_msg" "$cmd_ok_msg" "$cmd_err_msg" "$cmd_err_code"

fi

CUR_STEP=run_optimizer

cmd_step="bazel-bin/tensorflow/python/tools/optimize_for_inference --input=$TF_DATA/$TF_PREFIX-retrained_graph.pb --output=$TF_DATA/$TF_PREFIX-optimized_graph.pb --input_names=Mul --output_names=final_result"
cmd_log_path=$TF_CMD_LOGS/$CUR_STEP
cmd_msg="Optimizing model for inference..."
cmd_ok_msg="tools/optimize_for_inference run complete."
cmd_err_msg="Error running optimize_for_inference, check $ERROR_FAQ_URL#$CUR_STEP for more."
cmd_err_code=$CUR_STEP
runAndCheckCMD "$cmd_step" "$cmd_log_path" "$cmd_msg" "$cmd_ok_msg" "$cmd_err_msg" "$cmd_err_code"


########### STEP 3 - Quantize Graph


if [ ! -f bazel-bin/tensorflow/tools/quantization/quantize_graph  ]; then

    CUR_STEP=build_quantizer

    cmd_step="bazel build tensorflow/tools/quantization:quantize_graph"
    cmd_log_path=$TF_CMD_LOGS/$CUR_STEP
    cmd_msg="Quantize graph bazel bin not found. Building..."
    cmd_ok_msg="tools/quantization:quantize_graph build complete."
    cmd_err_msg="Error building quantization:quantize_graph, check $ERROR_FAQ_URL#$CUR_STEP for more."
    cmd_err_code=$CUR_STEP
    runAndCheckCMD "$cmd_step" "$cmd_log_path" "$cmd_msg" "$cmd_ok_msg" "$cmd_err_msg" "$cmd_err_code"

fi

CUR_STEP=run_quantizer

cmd_step="bazel-bin/tensorflow/tools/quantization/quantize_graph --input=$TF_DATA/$TF_PREFIX-optimized_graph.pb --output=$TF_DATA/$TF_PREFIX-rounded_graph.pb --output_node_names=final_result --mode=weights_rounded"
cmd_log_path=$TF_CMD_LOGS/$CUR_STEP
cmd_msg="Quantizing model..."
cmd_ok_msg="quantize_graph complete."
cmd_err_msg="Error running quantize_graph, check $ERROR_FAQ_URL#$CUR_STEP for more."
cmd_err_code=$CUR_STEP
runAndCheckCMD "$cmd_step" "$cmd_log_path" "$cmd_msg" "$cmd_ok_msg" "$cmd_err_msg" "$cmd_err_code"


########### STEP 3 - Memmapping


if [ ! -f bazel-bin/tensorflow/contrib/util/convert_graphdef_memmapped_format  ]; then

    CUR_STEP=build_memmapping

    cmd_step="bazel build tensorflow/contrib/util:convert_graphdef_memmapped_format"
    cmd_log_path=$TF_CMD_LOGS/$CUR_STEP
    cmd_msg="Memmapping bazel bin not found. Building..."
    cmd_ok_msg="util/convert_graphdef_memmapped_format build complete."
    cmd_err_msg="Error building convert_graphdef_memmapped_format, check $ERROR_FAQ_URL#$CUR_STEP for more."
    cmd_err_code=$CUR_STEP
    runAndCheckCMD "$cmd_step" "$cmd_log_path" "$cmd_msg" "$cmd_ok_msg" "$cmd_err_msg" "$cmd_err_code"

fi

CUR_STEP=run_memmapping


cmd_step="bazel-bin/tensorflow/contrib/util/convert_graphdef_memmapped_format --in_graph=$TF_DATA/$TF_PREFIX-rounded_graph.pb --out_graph=$TF_DATA/$TF_PREFIX-mmapped_graph.pb"
cmd_log_path=$TF_CMD_LOGS/$CUR_STEP
cmd_msg="This step can take 5+ minutes. Memmapping model..."
cmd_ok_msg="Memmapping complete."
cmd_err_msg="Error running convert_graphdef_memmapped_format, check $ERROR_FAQ_URL#$CUR_STEP for more."
cmd_err_code=$CUR_STEP
runAndCheckCMD "$cmd_step" "$cmd_log_path" "$cmd_msg" "$cmd_ok_msg" "$cmd_err_msg" "$cmd_err_code"

#### FINISH AND PRINT TOTAL TIME

SCRIPT_END_SECONDS=$SECONDS
SCRIPT_DURATION=$(($SCRIPT_END_SECONDS - $SCRIPT_START_SECONDS))
SCRIPT_DURATION_MIN=$(($SCRIPT_DURATION / 60))
SCRIPT_DURATION_SEC=$(($SCRIPT_DURATION % 60))

printf "${BLUE}Completed build and retraining${NORMAL}. Total time: %dm %ds.\n\n" "$duration_min" "$duration_sec"
