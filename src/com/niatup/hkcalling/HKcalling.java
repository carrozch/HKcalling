package com.niatup.hkcalling;

import android.os.Bundle;
import org.apache.cordova.*;

public class HKcalling extends DroidGap
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {   	 	
        super.onCreate(savedInstanceState);
        
    	super.clearCache();
         
        super.loadUrl(Config.getStartUrl());
    }
}