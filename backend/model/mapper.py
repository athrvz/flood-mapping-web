import os
import pandas as pd
import numpy as np
import rasterio

import matplotlib.pyplot as plt
import albumentations as A
from osgeo import gdal

import tensorflow as tf 
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Dropout

INP_SHAPE = 512
N_CHANNELS = 3
BATCH_SIZE = 4

def bce_jaccard_loss(y_true, y_pred, smooth=1):

    intersection = K.sum(K.abs(y_true * y_pred), axis=-1)
    sum_ = K.sum(K.abs(y_true) + K.abs(y_pred), axis=-1)
    jac = (intersection + smooth) / (sum_ - intersection + smooth)
    
    return (1 - jac) * smooth + tf.keras.losses.binary_crossentropy(y_true, y_pred)

model = load_model('.\\model\\EffUnetB0_512_3.h5', custom_objects={'FixedDropout': Dropout, 'bce_jaccard_loss': bce_jaccard_loss})
# model = load_model('.\\model\\EffUnetB0_512_3_weak_1.h5', custom_objects={'FixedDropout': Dropout, 'bce_jaccard_loss': bce_jaccard_loss})

def getX():
    img_list = os.listdir('uploads/')
    print(img_list)
    with rasterio.open('.\\uploads\\{}'.format(img_list[0])) as fvh:
        vh = fvh.read(1)
    with rasterio.open('.\\uploads\\{}'.format(img_list[1])) as fvv:
        vv = fvv.read(1)
    X = np.zeros((INP_SHAPE, INP_SHAPE, 3))
    X[:, :, 0] = (vh - (-17.54)) / 5.15
    X[:, :, 1] = (vv - (-10.68)) / 4.62
    return X 

def plot_val(models, plot=True):
    print('Mapping...')
    cnt = 1
    X = getX()
    # mask = process_mask(gdal.Open('train_labels/{}.tif'.format(path)).ReadAsArray())
    preds = []
    
    for model in models:
        pred = model.predict(X[np.newaxis, :, :, :])[0, :, :, 0]
        preds.append(pred)
        
    pred = np.mean(preds, axis=0)
        
    pred_thresh = pred.copy()
    pred_thresh[pred_thresh > 0.5] = 1
    pred_thresh[pred_thresh <= 0.5] = 0
    pred_thresh = pred_thresh.astype(int)
    
    if plot:
        _, ax = plt.subplots(1, 3, figsize=(16, 4))
    
        ax[0].imshow(X[:, :, 0])
        ax[0].set_title('vh')
        # ax[1].imshow(mask)
        # ax[1].set_title('gt')
        ax[1].imshow(pred)
        ax[1].set_title('pred')
        ax[2].imshow(pred_thresh)
        ax[2].set_title('thresh_pred')
        # if mask.sum() == 0 and pred_thresh.sum() == 0:
        #     iou = 1
        # else:
        #     intersection = np.logical_and(mask, pred_thresh).sum()
        #     union = np.logical_or(mask, pred_thresh).sum()
        #     iou = intersection / union
        # plt.suptitle(iou)
        plt.savefig('.\\uploads\\' + 'results.png')
        cnt += 1
        # plt.show()
    
    return pred

pred = plot_val(models = [model])
print(pred)